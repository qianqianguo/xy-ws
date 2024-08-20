import * as React from "react";
import {
	Container,
} from "react-bootstrap";
import {message} from "antd";
import LS from 'leancloud-storage';
import KeepAlive from "react-activation";
import withRouter from "../util/withRouter";
import Ellipsis from "../util/ellipsis";
import Video from "./views/video";
import '../css/manager.css';

//以下引用可以减少包体积
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {Delete} from "@material-ui/icons";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

class Manager extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			videoList: [],
			curItem: {},
			open: false,
			isOpen: false,
		}
		this.startCreatedAt = new Date();
		this.endCreatedAt = new Date();
	}
	componentDidMount() {
		this.getVideoList(true);
	}
	componentWillUnmount() {}
	
	getVideoList(isNextPage = true) {
		const query = new LS.Query('Video');
		const curUser = LS.User.current();
		query.equalTo('creator', curUser);
		query.limit(8);
		if(isNextPage){
			query.lessThan('createdAt', this.endCreatedAt);
			query.descending('createdAt');
		} else {
			query.greaterThan('createdAt', this.startCreatedAt);
			query.ascending('createdAt');
		}
		query.find().then((videos) => {
			let list = [];
			if (videos.length > 0) {
				this.startCreatedAt = videos[0].createdAt;
				this.endCreatedAt = videos[videos.length - 1].createdAt;
			} else {
				message.warning('没有更多视频...');
				// this.props.enqueueSnackbar(
				// 	'没有更多视频...',
				// 	{variant: 'warning' }
				// );
				return;
			}
			videos.forEach((video, i)=>{
				let video_json = video.toJSON();
				let video_file = video.get('video')?.toJSON();
				let video_obj = {
					id: video_json.objectId,
					img: video_file.url,
					title: video_json.title,
					description: video_json.description,
				};
				list.push(video_obj)
			})
			this.setState({
				videoList: list,
			})
		}).catch(e=>{
			message.error('获取数据错误', e);
		});
	}
	
	deleteVideo = () => {
		const {videoList, curItem} = this.state;
		this.setState({
			open: false,
			isOpen: true,
		});
		const video = LS.Object.createWithoutData('Video', curItem.id);
		video.destroy().then(()=>{
			videoList.some((item, i) => {
				if (item.id === curItem.id) {
					videoList.splice(i, 1);
					return true
				}
			})
			this.setState({
				isOpen: false,
				videoList,
			});
		}).catch(()=>{
			this.setState({
				isOpen: false,
			});
			alert('删除失败');
		})
	}
	
	handleClickOpen = (item) => {
		this.setState({
			open: true,
			curItem: item,
		});
	};
	
	handleClose = () => {
		this.setState({
			open: false,
			isOpen: false,
		});
	};
	
	render() {
		const {videoList, open, isOpen} = this.state;
		return <Container
			style={{
				display: 'flex',
				width: '100vm',
				minHeight: '100vh',
				flexDirection: 'column',
			}}>
			<div style={{
				margin: 12,
				minHeight: 88,
				borderRadius: 8,
				boxShadow: '0px 2px 8px #f2f2f2',
				display: 'flex',
				flexDirection: 'column',
				paddingLeft: 22,
				paddingRight: 22,
				backgroundColor: 'white',
			}}>
				<div
					style={{
						marginTop: 12,
						marginBottom: 12,
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
						}}/>
						<div>创作列表</div>
				</div>
				<Box sx={{ width: 'auto', maxHeight: 588, overflowY: 'scroll' }}>
					<ImageList variant="masonry" cols={4} gap={8}>
						{videoList.map((item) => (
							<ImageListItem key={item.img}>
								<Video item={item}/>
								<ImageListItemBar
									style={{borderRadius: 8}}
									title={
										<Tooltip disableFocusListener title={item.title}>
											<div>
												<Ellipsis line={2}>
													<text
														style={{
															fontSize: 12,
															fontWeight: 'bold',
															color: '#fff',
														}}>
														{item.title}
													</text>
												</Ellipsis>
											</div>
										</Tooltip>}
									subtitle={
										<div>
											<Tooltip disableFocusListener title={item.description}>
												<div>
													<Ellipsis
														line={2}
														textStyle={{
															fontSize: 8,
															lineHeight: 1.4,
														}}>
														{item.description}
													</Ellipsis>
												</div>
											</Tooltip>
											<Tooltip
												disableFocusListener
												title={'删除'}>
												<IconButton
													onClick={()=>{
														this.handleClickOpen(item);
													}}
													size={'small'}
													aria-label="delete"
													style={{
														backgroundColor: 'rgba(255,255,255,0.2)',
														color: '#fff'
													}}>
													<Delete style={{fontSize: 10}}/>
												</IconButton>
											</Tooltip>
										</div>
									}
									position="bottom"
								/>
							</ImageListItem>
						))}
					</ImageList>
				</Box>
				<div style={{display: 'flex', flexDirection: 'row-reverse', padding: 12}}>
					<ButtonGroup size="small" variant="contained" aria-label="text button group">
						<Button onClick={()=>this.getVideoList(false)} style={{fontSize: 12}}>上一页</Button>
						<Button onClick={()=>this.getVideoList(true)} style={{fontSize: 12}}>下一页</Button>
					</ButtonGroup>
				</div>
				<Dialog
					open={open}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title" style={{fontSize: 16}}>
						{"你确定删除此视频么？"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText style={{fontSize: 13}} id="alert-dialog-description">
							删除此视频后将不可恢复，你可以重新在发布视频页面发布更多视频...
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose}>取消</Button>
						<Button onClick={this.deleteVideo} autoFocus>
							删除
						</Button>
					</DialogActions>
				</Dialog>
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={isOpen}
					onClick={this.handleClose}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			</div>
		</Container>
	}
}

function withManager() {
	return (
		<KeepAlive>
			<Manager />
		</KeepAlive>
	)
}
export default withRouter(withManager);
