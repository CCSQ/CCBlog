import api from '../../api'

export default {
	getIsLogin(){
		return api.get('public/getIsLogin',{})
	},

	checkUser(id){
		return api.get('public/idIsExist', {id: id})
	},

	userLogin(user){
		return api.post('public/login', user)
	}

}