import * as React from "react";
import {Image} from "react-bootstrap";
import { Layout, Select } from 'antd';
import login_bg from "../assert/images/logo.svg";
const { Option } = Select;

export default class Home extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			fansCount: 0,
			videoPlayCount: 0,
			graphicCount: 0,
		}
	}
	componentDidMount() {}
	componentWillUnmount() {}
	handleChange = value=> {
		console.log(`selected ${value}`);
	}
	
	render() {
		return <Layout style={{minHeight: '100vh'}}>
			<div
				style={{
					flex: 1,
					minWidth: 688,
					maxWidth: 888
				}}>
				<div style={{
					margin: 12,
					minHeight: 88,
					borderRadius: 8,
					boxShadow: '0px 2px 8px #f2f2f2',
					display: 'flex',
					alignItems: 'center',
					paddingLeft: 22,
					backgroundColor: 'white'
				}}>
					<Image
						src={login_bg}
						style={{
							width: 60,
							height: 60,
							backgroundColor: 'red'
						}}
						roundedCircle/>
					<div
						style={{
							display: 'flex',
							marginLeft: 22,
							flexDirection: 'column',
						}}>
						<div
							style={{
								fontWeight: 'bold',
								fontSize: 16,
							}}>追光者的胜利</div>
						<div
							style={{
								marginTop: 8,
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center'
							}}>
							{['粉丝', '获赞与收藏'].map(item=>{
								return (
									<div
										style={{
											fontSize: 12,
											fontFamily: 'revert'
										}}>51 <text
										style={{
											color: '#888',
											marginRight: 22,
											fontSize: 13,
											fontFamily: 'cursive',
										}}>{item}</text></div>
								)
							})}
						</div>
					</div>
				</div>
				
				<div
					style={{
						margin: 12,
						borderRadius: 8,
						backgroundColor: 'white',
					}}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: 22,
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
								}}/>
							数据总览</div>
						<Select
							style={{fontSize: 10, minWidth: 68}}
							size={'small'}
							defaultValue="yesterday"
							onChange={this.handleChange}>
							<Option value="yesterday">昨日</Option>
							<Option value="7day">7天</Option>
							<Option value="halfMonth">
								半个月
							</Option>
							<Option value="month">一个月</Option>
						</Select>
					</div>
					
					<div
						style={{
							padding: 11,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						{['新增粉丝数', '图文阅读数', '视频播放量'].map(item=>{
							return (<div
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									backgroundColor: '#f2f2f2',
									borderRadius: 4,
									flex: 1,
									margin: 11,
									padding: 20,
									flexDirection: 'column',
								}}>
								<div
									style={{
										color: '#999',
										fontFamily: 'revert',
										fontSize: 12
									}}>{item}</div>
								<div
									style={{
										marginTop: 8,
										color: 'black',
										fontFamily: 'serif',
										fontSize: 16,
										fontWeight: 'bold'}}>{13}</div>
							</div>)
						})}
					</div>
					
					<div style={{minHeight: 399}}>
						<div
							style={{
								margin: 22,
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between'
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
									}}/>最新发布创作数据</div>
							<div style={{color: '#888', fontSize: 12}}>
								查看更多></div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	}
}
