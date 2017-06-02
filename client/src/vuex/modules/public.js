// 定义变量池和方法
import * as types from '../mutation-types'

// 变量池
const state = {
	showLoading: false,	
	isCanEdit: false,	// 能否编辑主页
	initParam: {},	// 初始化参数
	navList: [],	// 导航列表
}

// 定义方法
const mutations = {

	[types.SET_SHOW_LOADING](state, showLoading) {
		state.showLoading = showLoading
	},

	[types.SET_IS_CAN_EDIT](state, isCanEdit) {
		state.isCanEdit = isCanEdit
	},

	[types.SET_INIT_PARAM](state, param) {
		state.initParam = {}
		for (var i = param.length - 1; i >= 0; i--) {
			state.initParam[param[i].name] = param[i].param
		}
	},

	[types.SET_INIT_PARAM_BY_NAME](state, param) {
		state.initParam[param.name] = param.param
		// var temp = {}
		// for (var key in state.initParam) {
		// 	temp[key] = state.initParam[key]
		// }
		// state.initParam = temp
	},

	[types.SET_NAV_LIST](state, navList) {
		state.navList = navList
	},



}

export default {
	state,
	mutations
}
