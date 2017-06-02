import api from '../../api'

export default {

	getBrowNameByEmail(param){
		return api.get('public/getBrowNameByEmail',param)
	},

}