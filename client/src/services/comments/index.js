import api from '../../api'

export default {

	addComment(param){
		return api.post('public/addComment',param)
	},

	getCommentsByArticId(param) {
		return api.get('public/getCommentsByArticId',param)
	},

	getCommleListLimit() {
		return api.get('public/getCommleListLimit',{})
	},

}