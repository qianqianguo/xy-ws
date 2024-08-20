import * as React from "react";
import moment from 'moment';
import Zmage from 'react-zmage';
import LC from 'leancloud-storage';
import {
	FilterTwoTone,
	SearchOutlined,
} from '@ant-design/icons';
import {
	List, Avatar,
	Switch, Input, Modal,
	Layout, Button, Select,
	Drawer, DatePicker, Card,
	Row, message
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import placePic from '../assert/images/empty.png';
import {NumericInput} from "../component/NumberInput";
import Http from "../util/http";
import {IMClass} from "../Classes/IMClass";
import { object } from "prop-types";
const { Option } = Select;

const pStyle = {
	fontSize: 15,
	color: 'rgba(0,0,0,0.85)',
	display: 'block',
};

export default class Authorisations extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			visible: false,
			listData: [],
			lockVisible: false,
			confirmLoading: false,
			search_type: -1,
			phoneNumber: '',
			modalTitle: '',
			reason_description: '',
			review_description: null,
		}
		this.selItem = null;
		this.user_birthday = null;
	}
	componentDidMount() {
		this.searchUsers();
	}
	componentWillUnmount() {}
	showDrawer = () => {
		this.setState({
			visible: true,
		});
	};
	
	onClose = () => {
		this.setState({
			visible: false,
		});
	};
	render() {
		const {lockVisible, confirmLoading, listData, search_type, phoneNumber} = this.state;
		return <Layout style={{minHeight: '100vh'}}>
			<div style={{
				margin: 12,
				minHeight: 88,
				borderRadius: 8,
				boxShadow: '0px 2px 8px #f2f2f2',
				padding: 12,
				backgroundColor: 'white'
			}}>
				<List
					style={{width: 'auto'}}
					itemLayout="vertical"
					size="large"
					pagination={{
						onChange: page => {
							console.log(page);
						},
						pageSize: 3,
					}}
					dataSource={listData}
					header={
						<div style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start',
						}}>
							<Button type="link" onClick={this.showDrawer} style={{
								display: 'flex',
								alignItems: 'center',
								marginLeft: 12,
							}}>
								搜索
								<FilterTwoTone />
							</Button>
						</div>
					}
					footer={
						<div/>
					}
					renderItem={item => (
						<List.Item
							key={item.id}
							actions={[]}
							extra={
								<div>
									<Zmage
										style={{margin: 12}}
										width={256}
										alt="auth"
										src={item?.auth_zm !== '' ? item?.auth_zm : placePic}
									/>
									<Zmage
										style={{margin: 12}}
										width={256}
										alt="auth"
										src={item?.auth_fm !== '' ? item?.auth_fm : placePic}
									/>
								</div>
							}
						>
							<List.Item.Meta
								avatar={
									<Avatar
										src={item?.avatar}
										onClick={() => Zmage.browsing({ src: item.avatar })}
									/>
								}
								title={item?.nickname}
								description={
									<div style={{}}>
										{item.introduce}
									</div>
								}
							/>
							<div style={{alignItems: 'space-between'}}>
								<div style={{color: 'gray'}}>
									性别：<span style={{color: 'darkgray'}}>{item?.sex == 1 ? '男' : '女'}</span>
								</div>
								<br/>
								<div style={{color: 'gray'}}>
									手机号码：<span style={{color: 'darkgray'}}>{item?.mobilePhoneNumber}</span>
								</div>
								<br/>
								<Card style={{backgroundColor: "ghostwhite"}}>
									<div style={{color: 'gray'}}>
										头像认证状态：<span style={{color: 'darkgray'}}>{item?.avatar_state === 1 ? '待审核' : item?.avatar_state === 2 ? '已认证' : '未认证'}</span>
										<a
											style={{color: 'blue', marginLeft: 22}}
											onClick={()=>{
												this.selItem = item;
												this.showModal('审核头像信息', 2);
											}}>审核</a>
									</div>
									<div style={{color: 'gray'}}>
										<br/>
										上次认证描述：<span style={{color: 'darkgray'}}>{item?.avatar_reason ?? '未提审认证'}</span>
									</div>
								</Card>
								<br/>
								<Card style={{backgroundColor: "ghostwhite"}}>
									<div style={{color: 'gray'}}>
										身份认证状态：<span style={{color: 'darkgray'}}>
										{item?.auth_state === 1 ? '待审核' : item?.auth_state === 2 ? '已认证' : item?.auth_state === 3 ? '未通过' : '未认证'}
									</span>
										<a
											style={{color: 'blue', marginLeft: 22}}
											onClick={()=>{
												this.selItem = item;
												this.showModal('审核身份信息', 1);
											}}>审核</a>
									</div>
									<div style={{color: 'gray'}}>
										<br/>
										上次认证描述：<span style={{color: 'darkgray'}}>{item?.auth_reason ?? '未提审认证'}</span>
									</div>
								</Card>
								<br/>
								<Card style={{backgroundColor: "ghostwhite"}}>
									<div style={{color: 'gray'}}>
										用户申请注销：<span style={{color: 'darkgray'}}>{item?.isLogOff ? '已申请' : '未申请'}</span>
										{
											<a style={{color: 'blue', marginLeft: 22}} onClick={()=>{
												this.selItem = item;
												this.showModal('提示', 0);
											}}>注销</a>
										}
									</div>
									{
										item?.isLogOff && <div style={{color: 'gray'}}>
											<br/>
											提交注销日期：<span style={{color: 'darkgray'}}>
										{
											item?.logOffDate
												? moment(item?.logOffDate).format('YYYY.MM.DD  HH:mm:ss')
												: 'xxxx.xx.xx'
										}
									</span>
										</div>
									}
								</Card>
								<br/>
								<Card style={{backgroundColor: "ghostwhite"}}>
									<div style={{color: 'gray'}}>
										会员截止时间：<span style={{color: 'darkgray'}}>{
										item?.vip_expiration_date
											? moment(item?.vip_expiration_date).format('YYYY.MM.DD  HH:mm:ss')
											: 'xxxx.xx.xx'
									}</span>
									</div>
									<br/>
									<div style={{color: 'gray'}}>
										是否给予封号：
										<Switch
											style={{}}
											checked={item?.isLocked}
											onClick={(isLocked)=>{
												this.selItem = item;
												this.indexIsLocked = isLocked;
												this.showModal('提示', 3);
											}}
										/>
									</div>
								</Card>
							</div>
						</List.Item>
					)}
				/>
				<Drawer
					placement="top"
					closable={false}
					onClose={this.onClose}
					visible={this.state.visible}
					title="搜索查询"
					getContainer={false}
					height={256}
					headerStyle={{height: 68, fontSize: 12}}
				>
					<p style={{ ...pStyle}}>选择类型</p>
					<Row style={{}}>
						<Select defaultValue={0} style={{minWidth: 288}} onChange={this.handleChange}>
							<Option value={0}>按待审核身份查询</Option>
							<Option value={1}>按待审核头像查询</Option>
							<Option value={2}>按用户手机号查询</Option>
							<Option value={3}>按用户注销申请查询</Option>
						</Select>
						{search_type === 2 && <NumericInput
							style={{width: 200, marginLeft: 22}}
							onChange={(value)=>{
								this.setState({
									phoneNumber: value,
								})
							}}
							value={this.state.phoneNumber}
						/>}
						<Button type="primary" style={{marginLeft: 22, width: 79}} onClick={()=>{
							let isPhoneNumber =/^1[3456789]\d{9}$/;
							if(search_type === 2 && !isPhoneNumber.test(phoneNumber)){
								message.warning('请输入正确手机号');
								return;
							}
							this.onClose();
							this.openGetUserMessage();
						}}>
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
								<SearchOutlined/>
								<div>搜索</div>
							</div>
						</Button>
					</Row>
				</Drawer>
				<Modal
					title={this.state.modalTitle}
					visible={lockVisible}
					onOk={this.handleOk}
					okText={'确认'}
					cancelText={'取消'}
					confirmLoading={confirmLoading}
					onCancel={this.handleCancel}>
					{this.state.modalType !== 0 && this.state.modalType !== 3 ? this.renderReviewModal() :
						<p>{this.state.modalType === 0 ?
							'确认注销删除该用户么？删除后无法恢复，请谨慎操作。' :
							this.indexIsLocked ? '确认对该用户进行封号么？' : '需要解除对该用户封号处理么？'} </p>}
				</Modal>
			</div>
		</Layout>
	}
	renderReviewModal(){
		return (
			<>
				<Select
					placeholder={'请选择'}
					value={this.state.review_description}
					style={{minWidth: 168, marginTop: 12, marginBottom: 12}}
					onChange={this.handleReviewAuth}>
					<Option value={2}>通过</Option>
					<Option value={0}>拒绝</Option>
				</Select>
				{
					this.state.review_type === 0 &&
					<Input.TextArea
						rows={4}
						value={this.state?.reason_description ?? ''}
						placeholder={'拒绝原因...'}
						onChange = {({ target: { value } }) => {
							this.setState({ reason_description: value });
						}}
					/>
				}
				{
					this.state.review_type === 2 &&
					<DatePicker
						style={{minWidth: 200, marginLeft: 22}}
						locale={locale}
						placeholder={'请选择该用户生日'}
						showToday={false}
						onChange={(date, dateString) => {
							console.log(date, dateString);
							this.user_birthday = {
								"__type": "Date",
								"iso": moment('1990-12-01').toISOString() //restAPI就是需要这种方式，累人
							};
						}}
					/>
				}
				<br/>
			</>
		)
	}
	openGetUserMessage = () => {
		message.loading({ content: '正在查询...', key });
		this.searchUsers();
	};
	searchUsers(){
		const {search_type, phoneNumber} = this.state;
		let query = new LC.Query('_User');
		query.ascending('updatedAt'); //按时间递减查询
		if(search_type === 0){
			//先查认证表，再携带用户
			this.searchIdentifyAuth();
			return;
		}
		if(search_type === 1){
			query.equalTo('avatar_state', 1);
		}
		if(search_type === 2){
			query.equalTo('mobilePhoneNumber', '+86' + phoneNumber); //头像审核通过
		}
		if(search_type === 3){
			query.equalTo('isLogOff', true);
		}
		query.include('identifyAuth');
		query.descending('createdAt');
		query.find().then(r => {
			setTimeout(() => {
				message.success({ content: '查询完成', key, duration: 2 });
			}, 1000);
			this.setUsers(r);
		});
	}
	searchIdentifyAuth(){
		let query = new LC.Query('IdentifyAuth');
		query.equalTo('status', 1); //头像审核通过
		query.include('user');
		query.find().then(res => {
			setTimeout(() => {
				message.success({ content: '查询完成', key, duration: 2 });
			}, 1000);
			this.setUsers(res, true);
		});
	}
	setUsers(r, isIdentify = false){
		let users = [];
		for(let i = 0; i<r.length; i++){
			let user = isIdentify ? r[i]?.attributes?.user?.attributes : r[i]?.attributes;
			let avatar_url = user?.avatar?.attributes?.url ?? 'http://';
			let avatarId = user?.avatar?.get('objectId');
			let idCardBackground = isIdentify ? r[i]?.attributes?.idCardBackground?.attributes?.url : user?.identifyAuth?.attributes?.idCardBackground?.attributes?.url ?? '';
			let idCardFront = isIdentify ? r[i]?.attributes?.idCardFront?.attributes?.url : user?.identifyAuth?.attributes?.idCardFront?.attributes?.url ?? '';
			
			let idCardBackgroundId = isIdentify ? r[i]?.attributes?.idCardBackground?.get('objectId') : user?.identifyAuth?.attributes?.idCardBackground?.get('objectId');
			let idCardFrontId = isIdentify ? r[i]?.attributes?.idCardFront?.get('objectId') : user?.identifyAuth?.attributes?.idCardFront?.get('objectId');
			
			let auth_state = isIdentify ? r[i]?.attributes?.status : user?.identifyAuth?.attributes?.status ?? '';
			let uid = isIdentify ? r[i]?.attributes?.user?.id : r[i]?.id;
			let identifyId = isIdentify ? r[i]?.id : user?.identifyAuth?.id;
			let auth_reason = isIdentify ? r[i]?.attributes?.reason : '未提审认证';
			let sex = user?.sex;

			let user_obj = {
				id: uid,
				identifyId: identifyId,
				nickname: user?.nickname ?? user?.username,
				avatarId: avatarId,
				avatar: avatar_url,
				avatar_state: user?.avatar_state, //头像认证状态
				avatar_reason: user?.avatar_reason,
				introduce: user?.introduce,
				auth_zm: idCardFront,
				auth_fm: idCardBackground,
				auth_zmId: idCardFrontId,
				auth_fmId: idCardBackgroundId,
				auth_state: auth_state, //身份认证状态
				auth_reason: auth_reason,
				mobilePhoneNumber: user?.mobilePhoneNumber ?? '',
				isLogOff: user?.isLogOff,
				logOffDate: user?.logOffDate,
				isLocked: user?.isLocked,
				vip_expiration_date: user?.vip_expiration_date,
				sex: sex,
			}
			users.push(user_obj);
		}
		this.setState({
			listData: users,
		});
	}
	handleChange = (value)=> {
		console.log(`selected ${value}`);
		this.setState({
			search_type: value,
		})
	}
	
	handleReviewAuth = (value)=> {
		console.log(`selected ${value}`);
		this.setState({
			review_type: value,
			review_description: value === 0 ? '拒绝' : '通过',
		})
	}
	showModal = (modalTitle, modalType) => {
		this.setState({
			modalTitle: modalTitle,
			modalType: modalType,
			lockVisible: true,
			review_description: null,
			review_type: 1,
			reason_description: '',
		});
	};
	handleOk = () => {
		const {review_type, reason_description, listData, modalType} = this.state;
		if(review_type === 0 && !reason_description){
			message.warning('请填写拒绝原因');
			return;
		}
		if(modalType === 1 && !this.selItem?.identifyId){
			message.warning('该用户未提交认证，无需审核');
			this.handleReviewEnd();
			return;
		}
		this.setState({
			confirmLoading: true,
		});
		//2头像1身份证0注销3封号
		if(modalType === 2){
			let params = {
				avatar_state: review_type,
				avatar_reason: review_type === 0 ? reason_description : '尊敬的用户，您的头像经审核已予通过。',
				new_user_deadline: {
					"__type": "Date",
					"iso": moment(new Date()).toISOString() //restAPI就是需要这种方式，累人
				}, //审核头像通过，该用户变成7天新用户曝光给其他用户
			};
			Http.put(
				`/users/${this.selItem?.id ?? ''}`,
				params,
				true).then(res=>{
				//设置头像操作完成
				this.handleReviewEnd();
				message.success('审核操作成功');
				let index = listData.findIndex((item => item.id === this.selItem?.id));
				if(index !== -1){
					listData[index].avatar_state = params?.avatar_state;
					listData[index].avatar_reason = params?.avatar_reason;
				}
				this.forceUpdate();
				this.sendSystemRefresh(params?.avatar_reason);
			}).catch(err=>{
				this.handleReviewEnd();
				message.error('审核操作发生错误');
				console.log('什么错误：', err);
			})
		}
		if(modalType === 1){
			if(!this.user_birthday){
				message.warning('请选择用户生日');
				this.setState({
					confirmLoading: false,
				});
				return;
			}
			let params = {
				age: this.user_birthday,
				status: review_type === 0 ? 3 : 2,
				reason: review_type === 0 ? reason_description : '尊敬的用户，您的身份信息经审核已予通过。',
			};
			Http.put(
				`/classes/IdentifyAuth/${this.selItem?.identifyId ?? ''}`,
				params,
				true).then(res=>{
				Http.put(
					`/users/${this.selItem?.id ?? ''}`,
					{isAuthentication: true, age: this.user_birthday,},
					true).then(res=>{
					//设置身份操作完成
					this.handleReviewEnd();
					message.success('审核操作成功');
					let index = listData.findIndex((item => item.id === this.selItem?.id));
					if(index !== -1){
						listData[index].auth_state = params?.status;
						listData[index].auth_reason = params?.reason;
					}
					this.forceUpdate();
					this.sendSystemRefresh(params?.reason);
				}).catch(err=>{
					this.handleReviewEnd();
					message.error('审核操作发生错误');
					console.log('什么错误：', err);
				})
			}).catch(err=>{
				this.handleReviewEnd();
				message.error('审核操作发生错误');
				console.log('什么错误：', err);
			})
		}
		if(modalType === 0){
			//用户若提交了注销，是不可能在线的，所以直接删除即可，无需发送消息
			Http.delete(
				`/users/${this.selItem?.id ?? ''}`,
				true).then(res=>{
				//设置头像操作完成
				this.handleReviewEnd();
				message.success('该用户基础数据删除成功');
				let index = listData.findIndex((item => item.id === this.selItem?.id));
				if(index !== -1){
					listData?.splice(index, 1);
				}
				this.forceUpdate();
			}).catch(err=>{
				this.handleReviewEnd();
				message.error('删除用户错误');
				let index = listData.findIndex((item => item.id === this.selItem?.id));
				if(index !== -1){
					listData?.splice(index, 1);
				}
				this.forceUpdate();
			})

			//删除用户图片信息
			this.selItem && [this.selItem?.avatarId, this.selItem?.auth_zmId, this.selItem?.auth_fmId].map((imgId=>{
				if(!imgId)return;
				const file = LC.File.createWithoutData(imgId);
				file.destroy();
			}))
			if(this.selItem?.identifyId){
				const identifyAuth = LC.Object.createWithoutData("IdentifyAuth", this.selItem?.identifyId);
			    identifyAuth.destroy();
			}
		}
		if(modalType === 3){
			Http.put(
				`/users/${this.selItem?.id ?? ''}`,
				{isLocked: this.indexIsLocked},
				true).then(res=>{
				this.handleReviewEnd();
				message.success(this.indexIsLocked ? '已完成封号处理' : '解除封号成功');
				this.selItem.isLocked = this.indexIsLocked;
				this.forceUpdate();
				IMClass?.getServiceConversationAndSendMsg(()=>{
					console.log('已经完成封号处理');
				}, this.selItem?.id, '因你存在严重的违规平台行为，已给予封号处理', 2);
			}).catch(err=>{
				this.handleReviewEnd();
				message.error('封号处理发生错误');
			})
		}
	};
	sendSystemRefresh(reason_description){
		IMClass?.getServiceConversationAndSendMsg(()=>{
			console.log('完成消息发送成功');
		}, this.selItem?.id, reason_description, 3);
	}
	handleReviewEnd(){
		this.setState({
			lockVisible: false,
			confirmLoading: false,
		});
	}
	handleCancel = () => {
		console.log('Clicked cancel button');
		this.setState({
			lockVisible: false,
		});
	};
}

const key = 'getUsers';
