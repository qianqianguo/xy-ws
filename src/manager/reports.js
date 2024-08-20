import * as React from "react";
import {Layout, Card, message,
	Select, List, Avatar, Button,
	Skeleton, Switch,
	Drawer, Form,
	Input,
	DatePicker
} from 'antd';
import moment from 'moment';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import LC from "leancloud-storage";
import Zmage from "react-zmage";
import Http from "../util/http";
import {IMClass} from "../Classes/IMClass";
const { Option } = Select;
const count = 3;
const key = 'getReports';
export default class Report extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			initLoading: true,
			loading: false,
			isLoadingMore: true,
			data: [],
			list: [],
			drawerTitle: '',
			handle_type: undefined,
		}
		this.selItem = null;
		this.msgObject = 0; //0代表被举报者，1代表举报者
		this.createdAt = new Date();
		this.gag_deadline = null;
	}
	componentDidMount() {
		this.getData(res => {
			this.setState({
				initLoading: false,
				data: res,
				list: res,
			});
		});
	}
	componentWillUnmount() {}
	handleChange = value=> {
		console.log(`selected ${value}`);
		this.setState({
			handle_type: value,
		});
	}
	getData = callback => {
		let query = new LC.Query('Report');
		query.limit(10);
		query.include('plaintiff');
		query.include('defendant');
		query.include('story');
		query.lessThan('createdAt', this.createdAt);
		query.descending("createdAt");
		query.find().then(r => {
			if(r.length > 0){
				this.createdAt = r[r.length - 1]?.createdAt;
			} else {
				this.setState({
					isLoadingMore: false,
				});
			}
			this.setUsers(r, callback);
			setTimeout(() => {
				message.success({ content: '查询完成', key, duration: 2 });
			}, 1000);
		});
	};
	onLoadMore = () => {
		if(!this.state?.isLoadingMore){return;}
		this.setState({
			loading: true,
			list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
		});
		this.getData(res => {
			console.log('加载结果：', res);
			const data = this.state.data.concat(res);
			this.setState(
				{
					data,
					list: data,
					loading: false,
				},
				() => {window.dispatchEvent(new Event('resize'));},
			);
		});
	};
	showDrawer = ({title}) => {
		this.setState({
			visible: true,
			drawerTitle: title,
			handle_type: undefined,
		});
	};
	onClose = () => {
		this.setState({
			visible: false,
		});
	};
	onSubmit = () =>{
		const {handle_type, handle_description, list} = this.state;
		const report = LC.Object.createWithoutData("Report", this.selItem?.id);
		if(this.msgObject === 1){
			IMClass?.getServiceConversationAndSendMsg(()=>{
				message.success('已发送告知举报人');
				report.set("isFeedbackPlaintiff",true);
				report.save().then(res=>{
					console.log('已完成对举报人的反馈');
					let index = list.findIndex((item => item.id === this.selItem?.id));
					if(index !== -1){
						list[index].report.isFeedbackPlaintiff = true;
					}
					this.forceUpdate();
					this.onClose();
				});
			}, this.selItem?.plaintiffId, this.state?.handle_description);
			return;
		}
		if(!handle_description && handle_type !== 2){
			message.warning('请正确选择处理方式并填写描述');
			return;
		}
		report.set("isHandle",true);
		report.set("handle_type",handle_type);
		report.set("handle_description", handle_type !== 2 ? handle_description : '');
		report.save().then(res=>{
			if(handle_type === 1){
				//对用户禁言处理
				if(!this.gag_deadline){
					message.error('发生错误，请联系负责人');
					return;
				}
				Http.put(
					`/users/${this.selItem?.defendantId ?? ''}`,
					{
						gag_deadline: this.gag_deadline,
						numberOfViolations: (this.selItem?.defendant?.numberOfViolations ?? 0) + 1,
					},
					true).then(res=>{
					message.success('禁言成功');
					let index = list.findIndex((item => item.id === this.selItem?.id));
					if(index !== -1){
						list[index].report.isHandle = true;
						list[index].report.handle_type = handle_type;
						list[index].report.handle_description = handle_description;
					}
					this.forceUpdate();
				}).catch(err=>{
					message.error('审核操作发生错误');
					console.log('什么错误：', err);
				})
			}
			if(handle_type === 2){
				//对用户封号处理
				Http.put(
					`/users/${this.selItem?.defendantId ?? ''}`,
					{
						isLocked: true,
						numberOfViolations: (this.selItem?.defendant?.numberOfViolations ?? 0) + 1,
					},
					true).then(res=>{
					message.success('已完成对其封号');
					let index = list.findIndex((item => item.id === this.selItem?.id));
					if(index !== -1){
						list[index].report.isHandle = true;
						list[index].report.handle_type = handle_type;
					}
					this.forceUpdate();
				}).catch(err=>{
					message.error('审核操作发生错误');
					console.log('什么错误：', err);
				})
			}
			if(handle_type === 0){
				message.success('已对其做警告处理');
				let index = list.findIndex((item => item.id === this.selItem?.id));
				if(index !== -1){
					list[index].report.handle_description = handle_description;
					list[index].report.isHandle = true;
					list[index].report.handle_type = handle_type;
				}
				this.forceUpdate();
			}
			this.onClose();
			IMClass?.getServiceConversationAndSendMsg(()=>{
				message.success('已完成系统消息发送');
			}, this.selItem?.defendantId, this.state?.handle_description, handle_type);
		});
	}
	render() {
		const { initLoading, loading, list, handle_type, isLoadingMore } = this.state;
		const loadMore =
			!initLoading && !loading ? (
				<div
					style={{
						textAlign: 'center',
						marginTop: 22,
						height: 88,
						lineHeight: '32px',
					}}
				>
					<Button onClick={this.onLoadMore}>{isLoadingMore ? '加载更多' : '没有更多数据'}</Button>
				</div>
			) : null;
		return <Layout style={{minHeight: '100vh'}}>
			<div style={{
				margin: 12,
				borderRadius: 8,
				boxShadow: '0px 2px 8px #f2f2f2',
				padding: 12,
				backgroundColor: 'white'
			}}>
				<List
					loading={initLoading}
					style={{width: 'auto'}}
					itemLayout="vertical"
					loadMore={loadMore}
					dataSource={list}
					header={
						<div style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start',
							fontWeight: 'bold',
						}}>
							举报列表
						</div>
					}
					split={false}
					renderItem={item => (
						<List.Item
							key={item.id}
							actions={[]}
							// extra={}
						>
							<Skeleton avatar title={false} loading={item.loading} active>
								<List.Item.Meta
									avatar={
										<Avatar src={item?.plaintiff?.avatar?.attributes?.url} />
									}
									title={item?.plaintiff?.nickname ?? ''}
									description={item?.plaintiff?.introduce ?? ''}
								/>
							</Skeleton>
							<div>
								<Card style={{minWidth: 500}}>
									<div style={{display: 'flex'}}>
									<div>被举报人：</div>
									<List.Item.Meta
										avatar={
											<Avatar src={item?.defendant?.avatar?.attributes?.url} />
										}
										title={item?.defendant?.nickname ?? ''}
										description={
											<div>
												<div>
													{'被举报人ID：'+item?.plaintiffId ?? ''}
												</div>
												<div style={{marginTop: 6}}>
													{'被举报人手机号码：'+item?.plaintiff?.mobilePhoneNumber ?? ''}
												</div>
												<div style={{marginTop: 6}}>
													{'被举报次数：'+item?.plaintiff?.numberOfViolations ?? '0'}
												</div>
												<div style={{marginTop: 6}}>
													{'禁言截止日期：'+ (item?.plaintiff?.gag_deadline ?? '无禁言日期')}
												</div>
											</div>
										}
									/>
								</div>
									<div style={{}}>
										举报事项：<span style={{color: 'darkgray'}}>{!item?.storyId ? '用户个人使用规范' : '发布小事违规'}</span>
									</div>
									<br/>
									<div style={{}}>
										举报类型：<span style={{color: 'darkgray'}}>{JSON.parse(item?.report?.type ?? '{"title": "未知类型"}')?.title ?? ''}</span>
									</div>
									<br/>
									<div>
										举报原因：<span style={{color: 'darkgray'}}>{item?.report?.reason}</span>
									</div>
									<br/>
									<div>
										举报处理：<span style={{color: 'darkgray'}}>{item?.report?.isHandle ? '已处理' : '未处理'}</span>
									</div>
									<br/>
									<div style={{}}>
										举报图片证据：
										<div>
											{
												item?.images?.map((img=><Zmage
													style={{marginTop: 12, marginRight: 12}}
													width={256}
													alt="auth"
													src={img?.uri}
													key={img?.id}
													
												/>))
											}
										</div>
									</div>
									<br/>
									<div>
										<Button
											type="dashed"
											style={{minWidth: 100, marginTop: 12}}
											onClick={()=>{
												this.msgObject = 0;
												this.selItem = item;
												this.showDrawer({title: '处理违规用户'});
											}}
											disabled={item?.report?.isHandle}>
											{!item?.report?.isHandle ? '处理违规用户' : '已处理违规用户'}
										</Button>
										<Button
											type="dashed"
											style={{minWidth: 100, marginLeft: 12}}
											disabled={!item?.report?.isHandle || item?.report?.isFeedbackPlaintiff}
											onClick={()=>{
												this.msgObject = 1;
												this.selItem = item;
												this.showDrawer({title: '告知举报人'});
											}}>
											{item?.report?.isFeedbackPlaintiff ? '已告知举报人' : '告知举报人'}
										</Button>
									</div>
									{
										item?.report?.isHandle &&
										<div>
											<br/>
											<Card  style={{color: "gray"}}>
												<div>
													{
														'处理方式：' + (item?.report?.handle_type == 0 ? '普通警告' :
															item?.report?.handle_type == 1 ? '禁言警告' : '封号处理')
													}
												</div>
												<div style={{marginTop: 6}}>
													{'处理描述：'+item?.report?.handle_description ?? ''}
												</div>
											</Card>
										</div>
									}
								</Card>
								<br/>
								{
									item?.storyId && <div>
										<Card>
											<div style={{}}>
												被举报小事详情：
												<Card>
													<div>
														小事ID：<span style={{color: 'darkgray'}}>{item?.storyId ?? ''}</span>
													</div>
													<div>
														小事标签：<span style={{color: 'darkgray'}}>{item?.story?.theme ?? ''}</span>
													</div>
													<div>
														小事内容：<span style={{color: 'darkgray'}}>{item?.story?.content ?? ''}</span>
													</div>
													小事图片：
													<div>
														{
															item?.story?.images?.map((img=><Zmage
																style={{marginTop: 12, marginRight: 12}}
																width={68}
																alt="auth"
																src={img?.uri}
															/>))
														}
													</div>
													<br/>
													<div style={{color: 'gray'}}>
														是否屏蔽该小事：
														<Switch
															style={{}}
															checked={item?.story?.isShielded ?? false}
															onClick={(isLocked)=>{
																console.log('是否屏蔽：', isLocked);
																this.shieldedStory(item, isLocked);
															}}
														/>
													</div>
												</Card>
											</div>
										</Card>
										<br/>
									</div>
								}
							</div>
							<div style={{
								display: 'flex',
								height: 6,
								backgroundColor: '#f2f2f2'
							}}/>
						</List.Item>
					)}
				/>
				<Drawer
					closable={false}
					title={this.state?.drawerTitle ?? ''}
					width={558}
					onClose={this.onClose}
					visible={this.state.visible}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" hideRequiredMark>
						{
							this.msgObject === 0 &&
							<Form.Item label="处理方式">
								<Select
									placeholder="请选择处理方式..."
									value={handle_type}
									onChange={this.handleChange}>
									<Option value={0}>普通警告</Option>
									<Option value={1}>禁言警告</Option>
									<Option value={2}>封号处理</Option>
								</Select>
							</Form.Item>
						}
						{
							this.msgObject === 0 && handle_type === 1 &&
							<Form.Item label="设置禁言截止时间">
								<DatePicker
									style={{ width: '100%' }}
									locale={zhCN}
									getPopupContainer={trigger =>trigger.parentNode}
									onChange={(date, dateString)=> {
										this.gag_deadline = {
											"__type": "Date",
											"iso": moment(dateString).toISOString() //restAPI就是需要这种方式，累人
										};
									}}
								/>
							</Form.Item>
						}
						{
							handle_type !== 2 &&
							<Form.Item label="违规处理描述">
								<Input.TextArea
									rows={4}
									onChange={(e)=>{
										const { value } = e.target;
										this.setState({
											handle_description: value,
										});
									}}
									placeholder={this.msgObject === 0 ? "填写处理结果给违规用户，处理事项务必真实客观..."
										: '填写处理结果给举报人，处理事项务必真实客观...'}/>
							</Form.Item>
						}
					</Form>
					<div
						style={{
							position: 'absolute',
							right: 0,
							bottom: 0,
							width: '100%',
							borderTop: '1px solid #e9e9e9',
							padding: '10px 16px',
							background: '#fff',
							textAlign: 'right',
						}}
					>
						<Button onClick={this.onClose} style={{ marginRight: 8 }}>
							取消
						</Button>
						<Button onClick={this.onSubmit} type="primary">
							提交处理
						</Button>
					</div>
				</Drawer>
			</div>
		</Layout>
	}
	setUsers(r, callback){
		let reports = [];
		for(let i = 0; i<r.length; i++){
			let report = r[i]?.attributes;
			let report_id = r[i]?.id;
			let defendant = report?.defendant?.attributes ?? {};//被举报人
			let plaintiff = report?.plaintiff?.attributes ?? {};//举报人
			let report_story = report?.story?.attributes;
			let report_obj = {
				id: report_id,
				defendant: defendant,
				plaintiff: plaintiff,
				defendantId: report?.defendant?.id,
				plaintiffId: report?.plaintiff?.id,
				report: report,
				images: report?.images ?? [],
				storyId: report?.story?.id,
				story: report_story,
			}
			reports.push(report_obj);
		}
		callback(reports);
	}
	//屏蔽小事
	shieldedStory(item, isLocked){
		const story = LC.Object.createWithoutData("Story", item?.storyId);
		story.set("isShielded",isLocked);
		story.save().then(s=>{
			item.story.isShielded = isLocked;
			message.success(isLocked ? '已完成该条小事屏蔽' : '已解除该条小事屏蔽');
			this.forceUpdate();
		});
	}
}
