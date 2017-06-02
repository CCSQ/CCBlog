// 定义变量池和方法
import * as types from '../mutation-types'

// 变量池
const state = {
	inforList: [],
	isLoading: true,

}

// 定义方法
const mutations = {

	// [types.SET_INFOR_LIST](state, inforList) {
	// 	state.inforList = state.inforList.concat(inforList)
	// },

	// [types.SET_IS_LOADING](state, showLoading) {
	// 	state.showLoading = showLoading
	// },

	// [types.EMPTY_INFOR_LIST](state) {
	// 	state.inforList = []
	// 	state.isLoading = true
	// },

	// [types.SET_PRIVATE_INFOR](state,param) {
	// 	if (state.inforList[param.index].id == param.id) {
	// 		state.inforList[param.index].isPwd = true
	// 		state.inforList[param.index].title = param.infor[0]
	// 		state.inforList[param.index].infor = param.infor[1]
	// 	}
	// },

}

export default {
	state,
	mutations
}
