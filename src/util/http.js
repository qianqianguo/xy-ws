const baseUrl = 'https://api.moonxt.cn/1.1'; //服务器接口
const cloudUrl = 'https://cloud.moonxt.cn'; //云函数接口
const amapUrl = 'https://restapi.amap.com/v3'; //免费地图接口，需要个人认证后有五千次日配额调用
const timeoutSeconds = 10; // 网络超时

let header = {
	'X-LC-Id': '59KKxFhgwrf3S3UirLndVQ5D-gzGzoHsz',
	'X-LC-Key': '1DBEcEV3KfRQsDNrtzHCyGtJ',
	'Content-Type': 'application/json',
};
export default class Http {
	// PUT方法
	static async put(url, params, isMasterKey = false) {
		let requestUrl = baseUrl + url;
		if (isMasterKey) {
			header['X-LC-Key'] = '3RNKsCCIKv6vNFdmPAFnmo49,master';
		}
		let p1 = new Promise((resolve, reject) => {
			fetch(requestUrl, {
				method: 'PUT',
				headers: header,
				body: JSON.stringify(params),
			})
				.then(response => {
					return response.json();
				})
				.then(responseJson => {
					// 拿到数据可以在此同意处理服务器返回的信息
					console.log('responseData:', responseJson);
					if (responseJson.error && responseJson.error !== '') {
						reject(responseJson.error);
						return;
					}
					resolve(responseJson);
				})
				.catch(error => {
					console.log('requestError:', error);
					reject(error);
				});
		});
		let p2 = this.requestTimeout();
		/// 因为fetch网络请求没有超时时间设置，所以使用Promise实现请求超时
		return Promise.race([p1, p2]);
	}
	// DELETE方法
	static async delete(url, isMasterKey = false) {
		let requestUrl = baseUrl + url;
		if (isMasterKey) {
			header['X-LC-Key'] = '3RNKsCCIKv6vNFdmPAFnmo49,master';
		}
		let p1 = new Promise((resolve, reject) => {
			fetch(requestUrl, {
				method: 'delete',
				headers: header,
			})
				.then(response => {
					return response.json();
				})
				.then(responseJson => {
					// 拿到数据可以在此同意处理服务器返回的信息
					console.log('responseData:', responseJson);
					if (responseJson.error && responseJson.error !== '') {
						reject(responseJson.error);
						return;
					}
					resolve(responseJson);
				})
				.catch(error => {
					console.log('requestError:', error);
					reject(error);
				});
		});
		let p2 = this.requestTimeout();
		/// 因为fetch网络请求没有超时时间设置，所以使用Promise实现请求超时
		return Promise.race([p1, p2]);
	}
	// POST方法
	static async post(url, params,
		isMasterKey = false, isSingleUrl = false,
		hostType = '') {
		let requestUrl = (isSingleUrl ? '' : baseUrl) + url;
		if (isMasterKey) {
			header['X-LC-Key'] = '3RNKsCCIKv6vNFdmPAFnmo49,master';
		}
		if (hostType === 'cloud') {
			requestUrl = cloudUrl + url;
		}
		const body = JSON.stringify(params);
		let p1 = new Promise((resolve, reject) => {
			fetch(requestUrl, {
				method: 'POST',
				headers: header,
				body: body,
			})
				.then(response => {
					return response.json();
				})
				.then(responseJson => {
					// 拿到数据可以在此同意处理服务器返回的信息
					console.log('responseData:', responseJson);
					if (responseJson.error && responseJson.error !== '') {
						reject(responseJson.error);
						return;
					}
					resolve(responseJson);
				})
				.catch(error => {
					console.log('requestError:', error);
					reject(error);
				});
		});
		let p2 = this.requestTimeout();
		/// 因为fetch网络请求没有超时时间设置，所以使用Promise实现请求超时
		return Promise.race([p1, p2]);
	}
	// Get方法
	static get({url, params, name = ''}) {
		let base_url = baseUrl;
		if (name === 'amap') {
			//地图换主接口
			base_url = amapUrl;
		}
		let requestUrl = base_url + url;
		if (params) {
			requestUrl = this.parseGetParams(requestUrl, params);
		}
		let p1 = new Promise((resolve, reject) => {
			fetch(requestUrl, {
				method: 'GET',
				headers: header,
			})
				.then(response => {
					console.log('请求参数是什么情况a：', response);
					return response.json();
				})
				.then(responseJson => {
					// 拿到数据可以在此同意处理服务器返回的信息
					resolve(responseJson);
				})
				.catch(error => {
					reject(error);
				});
		});
		let p2 = this.requestTimeout();
		return Promise.race([p1, p2]);
	}
	// upload方法
	static async upload(url, params) {
		let requestUrl = baseUrl + url;
		let p1 = new Promise((resolve, reject) => {
			fetch(requestUrl, {
				method: 'POST',
				headers: header,
				body: params,
			})
				.then(response => {
					return response.json();
				})
				.then(responseJson => {
					// 拿到数据可以在此同意处理服务器返回的信息
					console.log('responseData:', responseJson);
					resolve(responseJson);
				})
				.catch(error => {
					console.log('requestError:', error);
					reject(error);
				});
		});
		let p2 = this.requestTimeout();
		/// 因为fetch网络请求没有超时时间设置，所以使用Promise实现请求超时
		return Promise.race([p1, p2]);
	}
	// download方法
	static async download(url, params) {
		// let dirs = RNFetchBlob.fs.dirs;
		// return RNFetchBlob.config({
		//   // response data will be saved to this path if it has access right.
		//   path: dirs.DocumentDir + '/videos',
		//   session: 'video',
		// }).fetch('GET', url, {
		//   //some headers ..
		// });
	}
	
	// 设置超时的方法
	static requestTimeout() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject('链接超时');
			}, timeoutSeconds * 1000);
		});
	}
	// 解析post方法的参数
	static parseGetParams(uri, params) {
		let url = uri;
		let paramsArray = [];
		//拼接参数
		Object.keys(params).forEach(key =>
			paramsArray.push(key + '=' + params[key]),
		);
		if (url.search(/\?/) === -1) {
			url += '?' + paramsArray.join('&');
		} else {
			url += '&' + paramsArray.join('&');
		}
		return url;
	}
	// 解析post方法的参数
	static parsePostParams(obj) {
		let ret = '';
		for (let key in obj) {
			ret += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
		}
		return ret;
	}
	isJSONString(str) {
		if (typeof str === 'string') {
			try {
				JSON.parse(str);
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		}
		console.log('It is not a string!');
	}
}
