// 定义变量池和方法
import * as types from '../mutation-types'

// 变量池
const state = {
	articleType: [],
}

// 定义方法
const mutations = {
	[types.SET_ARTICLE_TYPE](state, articleType) {
		state.articleType = articleType
	},
	[types.ADD_ARTICLE_TYPE](state, newType) {
		state.articleType.push(newType)
	},
	[types.DEL_ARTICLE_TYPE](state, delVal) {
		for (var i = state.articleType.length - 1; i >= 0; i--) {
			if (state.articleType[i].value === delVal) {
				state.articleType.splice(i,1)
			}
		}
	},
	[types.SET_ARTICLE_TYPE_IS_SHOW](state, delVal) {
		
		for (var i = state.articleType.length - 1; i >= 0; i--) {
			if (state.articleType[i].value === delVal.value) {
				state.articleType[i].isShow = !delVal.isShow
			}
		}
	},
}

export default {
	state,
	mutations
}
