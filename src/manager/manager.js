import * as React from "react";
import Stack from 'react-bootstrap/Stack';
import {
	FormText,
	Image,
} from "react-bootstrap";
import { Layout, Menu, Dropdown, Button, message } from 'antd';
import {
	AuditOutlined,
	LogoutOutlined,
	PicRightOutlined,
	ReadOutlined
} from '@ant-design/icons';
import LC from "leancloud-storage";
import {KeyboardArrowDown} from '@material-ui/icons';
import logo from "../assert/images/logo_28.png";
import default_avatar from "../assert/images/avatar.jpg";
import {Route, Routes, Link} from "react-router-dom";
import AuthList from "./authorisation";
import Report from "./reports";
import Stories from "./stories";
import Feedback from "./feedbacks";
import withRouter from "../util/withRouter";
import {connect} from "react-redux";
import {IMClass} from "../Classes/IMClass";
const { Header, Content, Sider } = Layout;

class Manager extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			selMenu: '/manager',
			menus: [{
				title: '审核用户',
				icon: <PicRightOutlined/>,
				key: '/manager',
			},
			{
				title: '审核小事',
				icon: <ReadOutlined />,
				key: 'stories',
			},
				{
					title: '举报列表',
					icon: <ReadOutlined />,
					key: 'report',
				},
				{
					title: '反馈列表',
					icon: <AuditOutlined />,
					key: 'feedback',
				},
			]
		}
	}
	componentDidMount() {
		document.body.style.backgroundColor = '#f2f2f2';
	}
	componentWillUnmount() {}
	
	render() {
		const {selMenu, menus} = this.state;
		return (
			<Layout style={{}}>
				<Header
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						padding: 0,
						height: 64,
						width: '100vm',
						zIndex: 999,
						backgroundColor: 'white',
						boxShadow: '0px 0px 8px #f2f2f2',
					}}>
					{this.renderStack()}
				</Header>
				<Sider
					style={{
						overflow: 'auto',
						height: '100vh',
						position: 'fixed',
						left: 0,
						zIndex: 998,
						marginTop: 64,
						backgroundColor: 'white',
					}}>
					<div style={{height: 1, backgroundColor: '#f2f2f2'}}/>
					<Menu
						style={{marginLeft: 1}}
						theme="light"
						mode="inline"
						onClick={item=>{
							this.setState({
								selMenu: item.key,
							})
						}}
						selectedKeys={[selMenu]}>
						{menus.map(menu=>{
							return (
								<Menu.Item key={menu.key} icon={menu.icon}>
									<Link to={menu.key}/>
									{menu.title}
								</Menu.Item>
							)
						})}
					</Menu>
				</Sider>
				<Content
					className="site-layout"
					style={{
						marginLeft: 200,
						marginTop: 64,
					}}>
					<Routes>
						<Route path="/" element={<AuthList />} />
						<Route path="stories" element={<Stories />} />
						<Route path="report" element={<Report />} />
						<Route path="feedback" element={<Feedback />} />
					</Routes>
				</Content>
			</Layout>
		)
	}
	
	menu = <div
		style={{
			display: 'flex',
			backgroundColor: 'white',
			width: '100vm',
			padding: 12,
			borderRadius: 4,
			boxShadow: '0px 2px 8px #eee',
		}}>
		<Button
			type={'text'}
			onClick={e=>{
				LC.User.logOut().then(res=>{
					IMClass?.closeIMClient(()=>{
						this.props.router.navigate('/sign_in');
					});
				}).catch(e=>{
					message.error(e.message);
				})
			}}
			style={{
				display: 'flex',
				fontSize: 12,
				alignItems: 'center'}}>
			<LogoutOutlined/>退出登录
		</Button>
	</div>;
	renderStack() {
		const currentUser = LC.User.current();
		let avatar_url = currentUser?.attributes?.avatar?.attributes?.url;
		let name = (currentUser?.attributes?.mobilePhoneNumber || currentUser?.attributes?.nickname) ?? ''
		return (
			<Stack
				style={{
					padding: 2,
					paddingLeft: 12,
					paddingRight: 22,
				}}
				direction="horizontal" gap={3}>
				<div style={{}}>
					<Image src={logo} style={{width: 20, height: 20, margin: 6, borderRadius: 2}}/>
					<FormText
						style={{
							color: '#000',
							fontFamily: '-moz-initial',
							fontWeight: 'bold',
							fontSize: 17,
						}}>Youla后台管理系统</FormText>
				</div>
				<Dropdown overlay={this.menu}>
					<a className="ms-auto"
					   style={{
						   flexDirection: 'row',
						   justifyContent: 'center',
						   textDecoration: 'none'
					   }}>
						<Image
							src={avatar_url ?? default_avatar}
							style={{
								width: 20,
								height: 20,
								backgroundColor: 'red'
							}} roundedCircle/>
						<FormText
							style={{
								color: '#888',
								fontSize: 12,
								marginLeft: 8,
								fontFamily: 'revert',
							}}>管理员：{name}</FormText>
						<KeyboardArrowDown
							style={{
								marginTop: -3,
								fontSize: 18,
								fontWeight: '200',
								fontFamily: 'serif',
								color: '#888',
							}}/>
					</a>
				</Dropdown>
			</Stack>
		)
	}
}

const mapStateToProps = (store) => {
	return store;
};
const mapDispatchToProps = (dispatch) => {
	return {
		dispatch
	}
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Manager))
