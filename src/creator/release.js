import * as React from "react";
import {
	Layout,
	message,
	Upload,
	Button,
	Input,
	Cascader,
	Radio,
	Select,
	Spin,
} from 'antd';
import $ from 'jquery';
import {
	CloudUploadOutlined, LoadingOutlined
} from '@ant-design/icons';
import Picker from 'emoji-picker-react';
import LC from "leancloud-storage";
import city from '../assert/data/city';
import {practice} from '../assert/data/creator';
import withRouter from "../util/withRouter";
import KeepAlive from "react-activation";
import {PlayArrow} from '@material-ui/icons'
const { Dragger } = Upload;

class Release extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			desc: [{
					title: '视频格式',
					con: '支持限定视频格式，',
					con2: '只支持使用mp4、mov、webm'
				},{
				title: '视频大小',
				con: '支持时长5分钟以内，',
				con2: '最大5GB的视频文件'
			}, {
				title: '视频分辨率',
				con: '推荐上传720P（1080*720）及以上视频，',
				con2: '超过1280P的视频用网页端上传画质更清晰'
			}],
			step: 'one',
			chosenEmoji: {},
			isShowEmoji: false,
			spFile: null, //视频文件
			title: '',
			description: '',
			themeId: '',
			addressId: '',
			address: [],
			permission: 0,
			spinning: false,
			pause: false,
		}
		this.thumbnail = null;
	}
	componentDidMount() {}
	componentWillUnmount() {}
	render() {
		const {spinning, step} = this.state;
		return (
			<Spin
				style={{color: 'blue'}}
				indicator={<LoadingOutlined />}
				spinning={spinning}
				tip={'正在发布...'}
				size={'large'}>
				<Layout
					style={{minHeight: '100vh'}}>
					<div
						style={{
							width: 888,
							margin: 22,
							borderRadius: 8,
							backgroundColor: 'white',
							boxShadow: '0px 0px 8px #f2f2f2',
						}}>
						<div
							style={{
								margin: 22,
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								backgroundColor: 'white',
							}}>
							<div
								style={{
									color: 'black',
									fontWeight: 'bold',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									fontSize: 16}}>
								<div
									style={{
										width: 3,
										backgroundColor: 'dodgerblue',
										height: 16,
										borderRadius: 2,
										marginRight: 12
									}}/>{step === 'one' ? '上传视频' : '发布视频'}</div>
						</div>
						{step === 'one' ? this.renderUploadVideo() : this.renderRelease()}
					</div>
				</Layout>
			</Spin>
		)
	}
	
	createImg() {
		let scale = 1;//将图片放大或缩小，缩小会失真
		const video = $('#upload_video')[0];
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.width = video.videoWidth * scale;
		canvas.height = video.videoHeight * scale;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		this.thumbnail = canvas.toDataURL("image/png");//图片base64
	}
	
	renderUploadVideo(){
		const {desc} = this.state;
		const props = {
			accept: 'video',
			name: 'file',
			multiple: false,
			action: '//sp.moonxt.cn',
			maxCount: 1,
			beforeUpload: file => {
				const isVideo = file.type === 'video/mp4';
				if (!isVideo) {
					message.error(`${file.name} 不是一个视频文件`).then(() => {});
				}
				return isVideo || Upload.LIST_IGNORE;
			},
			onChange: (info)=> {
				let file = info.file;
				const { status, name, type } = file;
				const reg = RegExp(/video/);
				if (status === 'error'){
					// if(!reg.test(type)){
					// 	message.error('只能上传视频格式文件');
					// 	return;
					// }
					this.setState({
						step: 'two',
						spFile: file,
					});
				}
			},
			onDrop(e) {console.log('Dropped files', e.dataTransfer.files);},
		};
		
		return (
			<div style={{
				margin: 22,
				marginTop: 0,
				flexDirection: 'row',
				display: 'flex',
				minHeight: 488
			}}>
				<div
					style={{flex: 1, paddingTop: 6, paddingBottom: 6}}>
					<Dragger {...props}>
						<p className="ant-upload-drag-icon">
							<CloudUploadOutlined />
						</p>
						<p style={{fontSize: 12, color: '#aaa', fontFamily: 'serif'}} className="ant-upload-text">点击上传或拖拽视频到此</p>
						<Button
							type={'primary'}
							style={{
								fontSize: 12,
								marginTop: 8,
							}}>上传视频</Button>
					</Dragger>
				</div>
				
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						marginTop: 0,
						marginLeft: 12
					}}>
					{desc.map(item=>{
						return (<div
							style={{
								display: 'flex',
								alignItems: 'center',
								width: '100vm',
								flex: 1,
								backgroundColor: '#f2f2f2',
								borderRadius: 4,
								margin: 6,
								padding: 12,
								flexDirection: 'column',
								minHeight: 100,
								justifyContent: 'center'
							}}>
							<div
								style={{
									color: 'black',
									fontFamily: 'revert',
									fontSize: 12
								}}>{item.title}</div>
							<div
								style={{
									marginTop: 8,
									color: '#999',
									fontFamily: 'serif',
									fontSize: 10,}}>
								{item.con}
							</div>
							<div
								style={{
									marginTop: 8,
									color: '#999',
									fontFamily: 'serif',
									fontSize: 10,}}>
								{item.con2}
							</div>
						</div>)
					})}
				</div>
			</div>
		)
	}
	
	renderRelease() {
		const {permission, isShowEmoji, spFile, title, description, pause} = this.state;
		return (
			<div style={{display: 'flex', flexDirection: 'row'}}>
				<div style={{marginLeft: 38, marginRight: 38}}>
					<div
						style={{
							fontSize: 14,
							fontWeight: 'bold',
						}}>视频编辑</div>
					<Input
						style={{
							marginTop: 22,
							marginBottom: 22,
							fontSize: 12,
							minHeight: 33,
						}}
						placeholder="填写标题，更容易获得小红星哦"
						value={title}
						onChange={e=>{
							let value = e.nativeEvent?.target?.value;
							if(value?.length > 20){
								message.warning('超过所限字数').then(r => {console.log('错误', r)});
								value = value.substr(0,20);
							}
							this.setState({
								title: value,
							})
						}}
						suffix={
							<div
								style={{
									color: '#ccc',
									fontSize: 12,
									display: 'flex',
									flexDirection: 'row-reverse',
									alignItems: 'center',
								}}>{'/20'}<div
								style={{
									color: '#000',
								}}>{title.length}</div>
							</div>
						}
					/>
					<Input.TextArea
						onChange={e=>{
							let value = e.nativeEvent?.target?.value;
							if(value?.length > 288){
								message.warning('超过所限字数').then(r => {});
								value = value.substr(0,288);
							}
							this.setState({
								description: value,
							});
						}}
						value={description}
						placeholder="填写更详细描述信息，让更多人更懂你吧！"
						style={{minHeight: 128, fontSize: 13}}
						rows={8} />
					<div
						style={{
							color: '#ccc',
							fontSize: 12,
							display: 'flex',
							flexDirection: 'row-reverse',
							alignItems: 'center',
						}}>{'/288'}<div
						style={{
							color: '#000',
						}}>{description.length}</div>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginTop: 12
						}}>
						<Button
							onClick={()=>{
								this.setState({
									isShowEmoji: !isShowEmoji,
								})
							}}
							style={{
								paddingLeft: 8,
								paddingRight: 8,
								fontSize: 10,
								color: '#888',
								marginRight: 22,
							}}>😊表情</Button>
						<Select
							labelInValue
							placeholder="#主题"
							style={{flex: 1}}
							onChange={this.onChange}>
							{practice.map(option=>{
								return (
									<Select.OptGroup label={option.title}>
										{option.subTitles.map(st=>{
											return (
												<Select.Option value={st.id}>{st.title}</Select.Option>
											)
										})}
									</Select.OptGroup>
								)
							})}
						</Select>
					</div>
					{
						isShowEmoji ? <Picker
							pickerStyle={{}}
							onEmojiClick={(event, emojiObject) => {
								this.setState({
									chosenEmoji: emojiObject,
									description: description + emojiObject.emoji,
								})
							}} /> : null
					}
					<div
						style={{
							marginTop: 68,
							marginBottom: 22,
							fontSize: 14,
							fontWeight: 'bold',
						}}>发布设置</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							color: '#888',
							fontSize: 13,
						}}>
						添加位置
						<Cascader
							style={{marginLeft: 22, fontSize: 12}}
							options={city}
							size={'small'}
							expandTrigger={'hover'}
							onChange={addr=>{
								this.setState({
									addressId: addr[2],
									address: addr,
								})
							}}
							placeholder="请选择"
							showSearch={this.filter}
						/>
					</div>
					<div style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						color: '#888',
						fontSize: 13,
					}}>
						权限设置
						<Radio.Group
							style={{margin: 22,}}
							onChange={e=>{
								this.setState({
									permission: e.target.value,
								})
							}}
							value={permission}>
							<Radio value={0}>
								<div
									style={{
										fontSize: 12,
										display: 'flex',
										flexDirection: 'row',
										color: '#222',
									}}>私密<div style={{color: '#ccc'}}>（仅自己可见）</div>
								</div>
							</Radio>
							<Radio value={1}>
								<div
									style={{
										fontSize: 12,
										display: 'flex',
										flexDirection: 'row',
										color: '#222'
									}}>
									公开<div style={{color: '#ccc'}}>（所有人可见）</div>
								</div>
							</Radio>
						</Radio.Group>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: 22,
							marginBottom: 68,
						}}>
						<Button
							onClick={()=>{
								this.releaseShortVideo();
							}}
							style={{marginRight: 68, minWidth: 122}}
							type={'primary'}
							danger
						>发布</Button>
						<Button
							onClick={()=>{
								this.setState({
									step: 'one',
								});
							}}
							style={{minWidth: 122}}
						>取消</Button>
					</div>
				</div>
				
				<div
					style={{
						width: 80 * 2.8 + 28,
						height: 170 * 2.8 + 28,
						backgroundColor: '#f2f2f2',
						borderRadius: 40,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						border: '1px solid #ccc',
						marginLeft: 46,
						boxShadow: '8px 8px 8px #f2f2f2',
						overflow: 'hidden',
					}}>
					<div
						onClick={()=>{
							if(pause){
								this.video && this.video.play();
							} else {
								this.video && this.video.pause();
							}
							this.setState({
								pause: !pause,
							})
						}}
						style={{
							width: 80 * 2.8,
							height: 170 * 2.8,
							backgroundColor: 'black',
							borderRadius: 28,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							overflow: 'hidden',
						}}>
						<Video
							getRef={r=>this.video = r}
							src={URL.createObjectURL(spFile?.originFileObj || {})}
						/>
						{pause && <div style={{
							display: 'flex',
							position: 'absolute',
							alignItems: 'center',
						}}>
							<PlayArrow
								fontSize={'large'}
								style={{
									color: '#fff',
									opacity: 0.8
								}}
							/>
						</div>}
					</div>
				</div>
			</div>
		)
	}
	
	onChange = value=> {
		this.setState({
			themeId: value.key,
		})
	}
	
	filter(inputValue, path) {
		return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
	}
	
	releaseShortVideo() {
		const {
			permission,
			themeId,
			spFile,
			title,
			description,
			address,
			addressId,
		} = this.state;
		this.createImg();
		if(!this.thumbnail){
			message.error('上传出错，抱歉，请联系客服').then(r => {});
			return;
		}
		const data = { base64:  this.thumbnail};
		const uploadFile = new LC.File(spFile?.name+'', spFile?.originFileObj);
		const uploadThumbnail = new LC.File((new Date()).getTime() + '.png', data);
		let video = new LC.Object('Video');
		video.set('creator', LC.User.current()); //发布者
		video.set('themeId', themeId); //视频主题id
		video.set('title', title); //视频标题
		video.set('description', description); //视频描述
		video.set('video', uploadFile); //视频文件
		video.set('thumbnail', uploadThumbnail); //视频文件缩略图
		video.set('addressId', addressId); //视频发布地址区ID
		video.set('address', address); //视频发布地址省市区
		video.set('permission', permission); //视频公开权限
		video.set('isPass', false); //视频是否审核通过
		this.setState({
			spinning: true,
		});
		video.save().then((res)=>{
			this.setState({
				spinning: false,
				step: 'one',
			})
			message.success('发布成功').then(r => {});
		}).catch(e=>{
			this.setState({
				spinning: false,
			})
			message.error('上传失败：'+JSON.stringify(JSON.stringify(e))).then(r => {});
		})
	}
}

//避免video一直被渲染
class Video extends React.Component {
	constructor(props) {
		super(props);
	}
	shouldComponentUpdate(nextProps) {
		return !nextProps.src === this.props.src;
	}
	
	render() {
		return <video
			id={'upload_video'}
			ref={this.props.getRef}
			style={{objectFit: 'contain'}}
			src={this.props.src}
			autoPlay={true}
			loop={true}
			width={80 * 2.8}
			height={170 * 2.8}
		/>;
	}
}

function withRelease() {
	return (
		<KeepAlive>
			<Release />
		</KeepAlive>
	)
}
export default withRouter(withRelease)
