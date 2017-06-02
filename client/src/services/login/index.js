import api from '../../api'

export default {
	getIsLogin(){
		return api.get('public/getIsLogin',{})
	},
}