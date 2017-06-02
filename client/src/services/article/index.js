import api from '../../api'

export default {
	// getComments(params){
	// 	return api.get('article/getComments',params)
	// },
	// getArticleInfor(params){
	// 	return api.get('article/articleInfor',params)
	// },
	// addComments(params){
	// 	return api.get('article/addComments',params)
	// },
	// getPrivateArticInfor(params){
	// 	return api.post('private/getPrivateArticInfor',params)
	// },

	getArticleType(){
		return api.get('article/getArticleType',{})
	},

	getArticNumInfor() {
		return api.get('public/getArticNumInfor',{})
	},

	getArticTime(params) {
		return api.get('public/getArticTime',params)
	},
	
	getArticListByTime(params) {
		return api.get('public/getArticListByTime',params)
	},

	getArticById(params) {
		return api.get('public/getArticById',params)
	},

	getArticByIdAndPwd(params) {
		return api.post('public/getArticByIdAndPwd',params)
	},

	getArticShowType() {
		return api.get('public/getArticShowType',{})
	},

	getTypeArtNum() {
		return api.get('public/getTypeArtNum',{})
	},

	getAllTags() {
		return api.get('public/getAllTags',{})
	},

	searchArtic(params) {
		return api.post('public/searchArtic',params)
	},

	getArticleListLimit() {
		return api.get('public/getArticleListLimit',{})
	},
}