import api from '../../api'

export default {
	getLogoPicList(){
		return api.get('pictures/getLogoPicList',{})
	},

	delLogoPic(param){
		return api.get('pictures/delLogoPic',param)
	},
}