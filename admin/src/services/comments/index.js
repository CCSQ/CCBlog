import api from '../../api'

export default {

	addComment(param){
		return api.post('public/addComment',param)
	},

	getCommentsByArticId(param) {
		return api.get('public/getCommentsByArticId',param)
	},

	setIsShow(param) {
		return api.get('comm/setCommIsShow',param)
	},

	deleteComm(param) {
		return api.get('comm/deleteComm',param)
	},

}