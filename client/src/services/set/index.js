import api from '../../api'

export default {

	setNavList(param){
		return api.post('set/setNavList',param)
	},

	saveInfor(param){
		return api.post('set/saveInfor',param)
	},

	getParam(param) {
		return api.get('public/getParam',param)
	}

}