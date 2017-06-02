import Vue from 'vue'
import VueResource from 'vue-resource'	// 发送http请求
import cookies from 'js-cookie'
import store from '../vuex/store'

Vue.use(VueResource)
const API_ROOT = process.env.api	// 服务器地址


// 定义拦截器
Vue.http.interceptors.push((request, next) => {
	// 请求前所做的逻辑
	Vue.http.headers.common['Authorization'] = window.sessionStorage.token
	// Vue.http.options.xhr = { withCredentials: true }
	// request.cr
	// store.commit("SET_SHOW_LOADING", true)
	// 请求发送后的逻辑
	next((response) => {
		// store.commit("SET_SHOW_LOADING", false)
		// 如果返回401代码，则退出登陆页
		// console.log(response)
		if (response.status === 401) {
			store.commit("SET_IS_LOGIN", false)
			window.location.hash = '#/login'
			return
		}

		// if (!response.status) {
		// 	window.location.hash = '#/login'
		// }
	})
})

export default {
	// 通用get方法
	get(url, param = {}) {
		return Vue.resource(API_ROOT + url).get(param)
	},

	// 通用post方法
	post(url, param = {}) {
		return Vue.http.post(API_ROOT + url, param, { emulateJSON : true})
	}

}
