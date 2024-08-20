import * as React from "react";
import Stack from 'react-bootstrap/Stack';
import {
	FormText,
	Image,
} from "react-bootstrap";
import { Layout, Menu, Dropdown, Button, message } from 'antd';
import {
	HomeOutlined,
	SettingOutlined,
	SnippetsOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import LC from "leancloud-storage";
import {KeyboardArrowDown} from '@material-ui/icons';
import logo from "../assert/images/logo.svg";
import {Route, Routes, Link} from "react-router-dom";
import Home from "./home";
import Helper from "./helper";
import Release from "./release";
import Manager from "./manager";
import withRouter from "../util/withRouter";
import {connect} from "react-redux";
const { Header, Content, Sider } = Layout;

class Create extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			selMenu: '/create',
			menus: [{
					title: '首页',
					icon: <HomeOutlined/>,
					key: '/create',
				},
				{
					title: '创作管理',
					icon: <SettingOutlined />,
					key: 'manager',
				},
				{
					title: '创作助手',
					icon: <SnippetsOutlined />,
					key: 'helper',
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
					<div
						key="release"
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Button
							type="primary"
							onClick={()=>{
								this.setState({
									selMenu: 'release',
								})
							}}
							style={{
								flex: 1,
								margin: 28,
								marginLeft: 16,
								marginRight: 16,
								fontSize: 15,
								borderRadius: 4,
							}}>
							<Link
								to={'release'}
								style={{textDecoration: 'none'}}>
								发布视频
							</Link>
						</Button>
					</div>
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
						<Route path="/" element={<Home />} />
						<Route path="release" element={<Release />} />
						<Route path="manager" element={<Manager />} />
						<Route path="helper" element={<Helper />} />
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
					this.props.router.navigate('/creator');
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
		return (
			<Stack
				style={{
					padding: 2,
					paddingLeft: 12,
					paddingRight: 22,
				}}
				direction="horizontal" gap={3}>
				<div style={{}}>
					<Image src={logo} style={{width: 40, height: 40, margin: 6}}/>
					<FormText
						style={{color: '#000',
							fontFamily: '-moz-initial',
							fontWeight: 'bold',
							fontSize: 17
						}}>创作服务平台</FormText>
				</div>
				<Dropdown overlay={this.menu}>
					<a href={''}
						className="ms-auto"
						 style={{
							 flexDirection: 'row',
							 justifyContent: 'center',
							 textDecoration: 'none'
						 }}>
						<Image
							src={logo}
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
							}}>追光者的胜利</FormText>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Create))
