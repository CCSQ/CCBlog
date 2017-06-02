// 分发操作
import * as types from './mutation-types'
import login from '../services/login'
import article from '../services/article'

export const setIsLogin = ({ commit,state }) => {
	login.getIsLogin().then(function (res) {
		if (state.login.isLogin) return
		commit(types.SET_IS_LOGIN, res.body)
	})
}

export const setArticleType = ({ commit,state }) => {
	if (state.article.articleType.length === 0) {
		article.getArticleType().then(function (res) {
			res.body.forEach((item) => {
				item.isShow = item.isShow === 1
			})
			commit(types.SET_ARTICLE_TYPE, res.body)
		})
	}
}

export const setArticleTypeIsShow = ({ commit,state }, type) => {
	commit(types.SET_ARTICLE_TYPE_IS_SHOW, type)
}

export const addArticleType = ({ commit,state }, newType) => {
	commit(types.ADD_ARTICLE_TYPE, newType)
}

export const delArticleType = ({ commit,state }, delValue) => {
	commit(types.DEL_ARTICLE_TYPE, delValue)
}

export const setLogin = ({ commit,state }, isLogin) => {
	commit(types.SET_IS_LOGIN, isLogin)
}