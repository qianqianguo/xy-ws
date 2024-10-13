import React from "react";
import {
	Navigate,
	Route,
	Routes,
} from "react-router-dom";
import LC from 'leancloud-storage';
// import App from "../App";
import Login from "../creator/login";
import Create from "../creator/create";
import SignIn from "../manager/sign_in";
import Manager from "../manager/manager";
import withRouter from "../util/withRouter";
import AppAgreement from "../AppAgreement";

//在这必须要引用，否则路由属性传递不到

function RootRoute(){
	const currentUser = LC.User.current();
	return (
		<Routes>
			<Route path="/" element={<SignIn />} />
			<Route
				path="creator"
				element={
					!currentUser ?
						<Login /> :
						<Navigate
							to={'/create'}
						/>
				}
			/>
			<Route
				path="create/*"
				element={
					currentUser ?
						<Create /> :
						<Navigate
							to={'/creator'}
						/>
				}
			/>
			<Route
				path="sign_in"
				element={
					!(currentUser && global.IMClient) ?
						<SignIn /> :
						<Navigate
							to={'/manager'}
						/>
				}
			/>
			<Route
				path="manager/*"
				element={
					currentUser && global.IMClient ?
						<Manager /> :
						<Navigate
							to={'/sign_in'}
						/>
				}
			/>
			<Route
				path="user-agreement"
				element={
					<AppAgreement
						title={'Youla 用户协议'}
						agreementType={'user_agreement'}
					/>
				}
			/>
			<Route
				path="privacy-policy"
				element={
					<AppAgreement
						title={'Youla 隐私政策'}
						agreementType={'privacy_policy'}
					/>
				}
			/>
			<Route
				path="vip-agreement"
				element={
					<AppAgreement
						title={'Youla 会员协议'}
						agreementType={'vip_agreement'}/>
				}
			/>
		</Routes>
	)
}

export default withRouter(RootRoute);
