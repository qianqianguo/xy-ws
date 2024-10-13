const renderContent = text => <text style={{color: 'yellow'}}>{text}</text>;
const columns = [
	{
		title: 'SDK名称',
		dataIndex: 'title',
		render: renderContent,
	},
	{
		title: 'SDK厂商',
		dataIndex: 'changShang',
		render: renderContent,
	},
	{
		title: '合作目的',
		dataIndex: 'muDi',
		render: renderContent,
	},
	{
		title: '收集个人信息',
		dataIndex: 'info',
		render: renderContent,
	},
	{
		title: 'SDK隐私政策链接',
		dataIndex: 'privacy',
		render: renderContent,
	},
];

const data = [
	// {
	// 	key: '0',
	// 	title: 'SDK名称',
	// 	changShang: 'SDK厂商',
	// 	muDi: '合作目的            ',
	// 	info: '收集个人信息',
	// 	privacy: 'SDK隐私政策链接',
	// },
	{
		key: 'A',
		title: 'LeanCloud 存储 SDK',
		changShang: '美味书签（北京）信息技术有限公司',
		muDi: '为 App 用户提供结构化数据存储技术服务',
		info: '无',
		privacy: 'https://docs.leancloud.cn/sdk/start/privacy/',
	},
	{
		key: 'B',
		title: 'LeanCloud RTM SDK',
		changShang: '美味书签（北京）信息技术有限公司',
		muDi: '为 App 用户提供实时聊天技术服务',
		info: '无',
		privacy: 'https://docs.leancloud.cn/sdk/start/privacy/',
	},
	// {
	// 	key: '3',
	// 	title: 'LeanCloud 混合推送 SDK',
	// 	changShang: '美味书签（北京）信息技术有限公司',
	// 	muDi: '为 App 用户提供消息推送技术服务',
	// 	info: '除厂商收集信息外，本 SDK 不收集个人信息',
	// 	privacy: 'https://docs.leancloud.cn/sdk/start/privacy/',
	// },
	{
		key: 'C',
		title: '微信支付 SDK',
		changShang: '深圳市腾讯计算机系统有限公司',
		muDi: '完成微信支付功能',
		info: '设备标识符，网络访问，获取Wi-Fi状态，关联唤醒',
		privacy: 'https://weixin.qq.com/cgi-bin/readtemplate?t=weixin_agreement&s=privacy',
	},
	{
		key: 'D',
		title: 'realm SDK',
		changShang: 'MongoDB, Inc.',
		muDi: '为 App 用户提供本地存储技术服务',
		info: '无',
		privacy: 'https://www.mongodb.com/zh-cn/legal/privacy-policy',
	},
];

export {
	columns,
	data,
}
