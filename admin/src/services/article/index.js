import api from '../../api'

export default {
	getArticleType(){
		return api.get('article/getArticleType',{})
	},

	addArticle(param) {
		return api.post('article/addArticle',param)
	},

	addArticType(param) {
		return api.post('article/addArticType',param)
	},

	getArticleInfor(param) {
		return api.get('article/getArticleInfor',param)
	},

	updateArticleIsShow(param) {
		return api.get('article/updateArticleIsShow',param)
	},

	deleteArticle(param) {
		return api.get('article/deleteArticle',param)
	},

	deleteArtType(param) {
		return api.get('article/deleteArtType',param)
	},

	updateArticle(param) {
		return api.post('article/updateArticle',param)
	},

	getTypeArtNum() {
		return api.get('article/getTypeArtNum',{})
	},

	changTypeIsShow(param) {
		return api.get('article/changTypeIsShow',param)
	},

	

}