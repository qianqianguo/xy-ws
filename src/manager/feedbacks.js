import * as React from "react";
import {Layout, Card, message, Select, List, Avatar, Button, Skeleton, Form, Input, Drawer} from 'antd';
import LC from "leancloud-storage";
import Zmage from "react-zmage";
import {IMClass} from "../Classes/IMClass";
const count = 3;
const key = 'getfeedbacks';
export default class Feedback extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			initLoading: true,
			loading: false,
			isLoadingMore: true,
			data: [],
			list: [],
			visible: '',
		}
		this.createdAt = new Date();
		this.selItem = null;
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
	showDrawer = () => {
		this.setState({
			visible: true,
		});
	};
	onClose = (handle_type) => {
		this.setState({
			visible: false,
		});
	};
	handleChange = value=> {
		console.log(`selected ${value}`);
	}
	getData = callback => {
		let query = new LC.Query('Feedback');
		query.include('user');
		query.descending("createdAt");
		query.lessThan('createdAt', this.createdAt);
		query.limit(10);
		query.find().then(r => {
			setTimeout(() => {
				message.success({ content: '查询完成', key, duration: 2 });
			}, 1000);
			if(r.length > 0){
				this.createdAt = r[r.length - 1]?.createdAt;
			} else {
				this.setState({
					isLoadingMore: false,
				});
			}
			this.setUsers(r, callback);
		});
	};
	
	onLoadMore = () => {
		if(!this.state?.isLoadingMore){return;}
		this.setState({
			loading: true,
			list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
		});
		this.getData(res => {
			const data = this.state.data.concat(res);
			this.setState(
				{
					data,
					list: data,
					loading: false,
				},
				() => {
					// Resetting window's offsetTop so as to display react-virtualized demo underfloor.
					// In real scene, you can using public method of react-virtualized:
					// https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
					window.dispatchEvent(new Event('resize'));
				},
			);
		});
	};
	render() {
		const { initLoading, loading, list, isLoadingMore } = this.state;
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
							反馈列表
						</div>
					}
					renderItem={item => (
						<List.Item
							actions={[]}
							// extra={}
						>
							<Skeleton avatar title={false} loading={item.loading} active>
								<List.Item.Meta
									avatar={
										<Avatar src={item?.user?.avatar?.attributes?.url} />
									}
									title={item?.user?.nickname ?? ''}
									description={item?.user?.introduce ?? ''}
								/>
							</Skeleton>
							<div>
								<Card style={{}}>
									<div style={{}}>
										反馈类型：<span style={{color: 'darkgray'}}>{JSON.parse(item?.feedback?.type ?? '{"title": "未知类型"}')?.title ?? ''}</span>
									</div>
									<br/>
									<div>
									  反馈内容：<span style={{color: 'darkgray'}}>{item?.feedback?.content}</span>
									</div>
									<br/>
									<div>
										反馈处理：<span style={{color: 'darkgray'}}>{item?.feedback?.isHandle ? '已处理' : '未处理'}</span>
									</div>
									<br/>
									<div style={{}}>
										反馈相关图片：
										<div>
											{
												item?.images?.map((img=><Zmage
													style={{marginTop: 12, marginRight: 12}}
													width={256}
													alt="auth"
													src={img?.uri}
												/>))
											}
										</div>
									</div>
									<br/>
									<Button
										type="dashed" style={{minWidth: 100}}
										onClick={()=>{
											this.selItem = item;
											this.showDrawer();
										}}
										disabled={item?.feedback?.isHandle}>
										{item?.feedback?.isHandle ? '已回返用户' : '回返用户意见'}</Button>
									{
										item?.feedback?.isHandle &&
										<div>
											<br/>
											<div>
												回返描述：<span style={{color: 'darkgray'}}>{item?.feedback?.return_content}</span>
											</div>
										</div>
									}
								</Card>
							</div>
						</List.Item>
					)}
				/>
				<Drawer
					closable={false}
					title={'回返用户反馈信息'}
					width={558}
					onClose={this.onClose}
					visible={this.state.visible}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" hideRequiredMark>
						<Form.Item label="回返描述">
							<Input.TextArea
								rows={4}
								onChange={(e)=>{
									const { value } = e.target;
									this.setState({
										handle_description: value,
									});
								}}
								placeholder={'填写回返用户的信息...'}/>
						</Form.Item>
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
	onSubmit = () =>{
		const {handle_description, list} = this.state;
		const feedback = LC.Object.createWithoutData("Feedback", this.selItem?.id);
		IMClass?.getServiceConversationAndSendMsg(()=>{
			message.success('已回返意见');
			feedback.set("isHandle", true);
			feedback.set("return_content", handle_description);
			feedback.save().then(res=>{
				console.log('已完成对举报人的反馈');
				let index = list.findIndex((item => item.id === this.selItem?.id));
				if(index !== -1){
					list[index].feedback.isHandle = true;
					list[index].feedback.return_content = handle_description;
				}
				this.forceUpdate();
				this.onClose();
			});
		}, this.selItem?.uid, this.state?.handle_description);
	}
	setUsers(r, callback){
		let feedbacks = [];
		for(let i = 0; i<r.length; i++){
			let feedback = r[i]?.attributes;
			let feedback_id = r[i]?.id;
			let user = feedback?.user?.attributes ?? {};
			let feedback_obj = {
				id: feedback_id,
				uid: feedback?.user?.id,
				user: user,
				feedback: feedback,
				images: feedback?.images ?? [],
			}
			feedbacks.push(feedback_obj);
		}
		callback(feedbacks);
	}
}
