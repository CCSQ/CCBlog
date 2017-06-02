import api from '../../api'

export default {
	getInitParam(){
		return api.get('public/getInitParam',{})
	},

	getNavList(){
		return api.get('public/getNavList',{})
	},

}