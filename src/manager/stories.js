import * as React from "react";
import {Layout, Card, message, Modal, List, Avatar, Button, Skeleton, Form, Input, Drawer} from 'antd';
import LC from "leancloud-storage";
import Zmage from "react-zmage";
import {IMClass} from "../Classes/IMClass";
const count = 6;
const key = 'getfeedbacks';
export default class Stories extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			initLoading: true,
			loading: false,
			isLoadingMore: true,
			data: [],
			list: [],
			visible: '',

			modelVisible: false,
			lockVisible: false,
			confirmLoading: false,
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
		let query = new LC.Query('Story');
		query.include('owner');
		// query.equalTo('isShielded', true);
		query.descending("createdAt");
		query.lessThan('createdAt', this.createdAt);
		query.limit(6);
		query.find().then(r => {
            console.log('查询的小事：', r[0]);
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
							小事列表
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
										<Avatar 
										onClick={() => Zmage.browsing({ src: item?.owner?.avatar?.attributes?.url})}
										src={item?.owner?.avatar?.attributes?.url} />
									}
									title={(item?.owner?.nickname ?? '')}
									description={item?.owner?.introduce ?? ''}
								/>
							</Skeleton>
							<div style={{fontSize: 12, marginBottom: 12}}>{("\n性别：" + (item?.feedback?.gender == 1 ? "男" : "女"))}</div>
							<div style={{fontSize: 12, marginBottom: 12}}>{("\n电话号码：" + item?.owner?.mobilePhoneNumber)}</div>
							
							<div>
								<Card style={{}}>
									<div>
									小事内容：<span style={{color: 'darkgray'}}>{item?.feedback?.content}</span>
									</div>
									<br/>
									<div style={{}}>
										小事相关图片：
										<div>
											{
												item?.images?.map((img=><div>
													<div>文件ID：{img?.file_id}</div>
													<Zmage
													style={{marginTop: 12, marginRight: 12}}
													width={256}
													alt="auth"
													src={img?.uri}
												/>
												</div>))
											}
										</div>
									</div>
									<br/>
									<Button
										type="dashed" style={{minWidth: 100}}
										onClick={()=>{
											this.selItem = item;
											this.showDrawer();
										}}>
										{item?.feedback?.isShielded ? '待审核查阅' : '屏蔽小事'}</Button>
									{
										item?.feedback?.isShielded &&
										<div>
											<br/>
											<div>
												屏蔽原因：<span style={{color: 'darkgray'}}>{item?.feedback?.ShieldedReason}</span>
											</div>
										</div>
									}
									<Button
										type="dashed" style={{minWidth: 100, marginLeft: 12}}
										onClick={()=>{
											this.selItem = item;
											this.setState({
												lockVisible: true,
											})
										}}>删除小事</Button>
								</Card>
							</div>
						</List.Item>
					)}
				/>
				<Drawer
					closable={false}
					title={'审核或屏蔽小事'}
					width={558}
					onClose={this.onClose}
					visible={this.state.visible}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" hideRequiredMark>
						<Form.Item label="操作事由">
							<Input.TextArea
								rows={4}
								onChange={(e)=>{
									const { value } = e.target;
									this.setState({
										handle_description: value,
									});
								}}
								placeholder={'填写操作小事原因...'}/>
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
				<Modal
					title={'确认删除么？'}
					visible={this.state.lockVisible}
					onOk={this.onDelete}
					okText={'确认'}
					cancelText={'取消'}
					confirmLoading={false}
					onCancel={()=>{
						this.setState({
							lockVisible: false,
						})
					}}>
						{'确认注销删除该用户么？删除后无法恢复，请谨慎操作。'}
				</Modal>
			</div>
		</Layout>
	}
	onDelete = () =>{
		const {list} = this.state;
		const feedback = LC.Object.createWithoutData("Story", this.selItem?.id);
		feedback.destroy().then(res=>{
			console.log('删除情况:',res)
			let index = list.findIndex((item => item.id === this.selItem?.id));
			if(index !== -1){
				list.splice(index, 1);
			}
			message.success('删除成功');
			this.forceUpdate();
			this.setState({
				lockVisible: false,
			})
		}).catch(e=>{
			console.log('没有删除小事')
			message.fail('删除失败');
			this.setState({
				lockVisible: false,
			})
		});
		this.selItem && this.selItem?.images?.map((img=>{
			if(!(img?.file_id))return;
			const file = LC.File.createWithoutData(img.file_id);
			file.destroy();
		}))
	}
	onSubmit = () =>{
		const {handle_description, list} = this.state;
		const feedback = LC.Object.createWithoutData("Story", this.selItem?.id);
		if(this.selItem.feedback.isShielded){
			feedback.set("isShielded", false);
			feedback.save().then(res=>{
				console.log('通过审核不屏蔽');
				message.success('审核通过小事');
				let index = list.findIndex((item => item.id === this.selItem?.id));
				if(index !== -1){
					list.splice(index, 1);
				}
				this.forceUpdate();
				this.onClose();
			});	
			return;
		}
		feedback.set("isShielded", true);
		feedback.set("ShieldedReason", handle_description);
			feedback.save().then(res=>{
				message.success('已屏蔽小事');
				let index = list.findIndex((item => item.id === this.selItem?.id));
				if(index !== -1){
					list[index].feedback.isShielded = true;
					list[index].feedback.ShieldedReason = handle_description;
				}
				this.forceUpdate();
				this.onClose();
			});	
	}
	setUsers(r, callback){
		let feedbacks = [];
		for(let i = 0; i<r.length; i++){
			let feedback = r[i]?.attributes;
			let feedback_id = r[i]?.id;
			let user = feedback?.owner?.attributes ?? {};
			let feedback_obj = {
				id: feedback_id,
				uid: feedback?.owner?.id,
				owner: user,
				feedback: feedback,
				images: feedback?.images ?? [],
			}
			feedbacks.push(feedback_obj);
		}
		callback(feedbacks);
	}
}
