import {message} from 'antd';
import LC from "leancloud-storage";
import Http from "../util/http";
const {Realtime} = require('leancloud-realtime');
const realtime = new Realtime({
	appId: '59KKxFhgwrf3S3UirLndVQ5D-gzGzoHsz',
	appKey: '1DBEcEV3KfRQsDNrtzHCyGtJ',
	server: 'https://api.moonxt.cn',
});

export class IMClass {
	static createIMClient(user, cb){
		return realtime.createIMClient(user).then(imClient=>{
			console.log('IM登录成功');
			global.IMClient = imClient;
			cb && cb();
		}).catch(e=>{
			console.log('什么错误：', e);
		});
	}
	static closeIMClient(cb){
		global.IMClient && global.IMClient?.close().then(()=>{
			global.IMClient = null;
			cb && cb();
		}).catch(e=>{
			message.error('退出客户端失败');
		});
	}
	//获取服务号并指定某个用户发送系统消息
	static getServiceConversationAndSendMsg(cb, toId, text, serviceId){
		//serviceId代表意义：0普通警告，1禁言，2封号，3发送消息刷新用户信息
		const currentUser = LC.User.current();
		let params = {
			from_client: currentUser?.id ?? '',
			to_clients: [toId],
			no_sync: currentUser?.id !== toId,
			message: JSON.stringify({
				serviceId: serviceId,//服务号发送类型ID，用着在客户端区别要去做的事情，比如刷新用户信息或其他
				text: text,
			}),
		};
		return  Http.post(
			'https://api.moonxt.cn/1.2/rtm/service-conversations/64ba0c20aebece3efcaa373f/messages',
			params,
			true, true).then(res=>{
			cb && cb();
		}).catch(err=>{
			message.error('发送系统消息错误');
			console.log('什么错误：', err);
		});
	};
}
