import api from '../../api'

export default {
	getAllPicDir(){
		return api.get('pictures/getAllPicDir',{})
	},
	getPicBydir(param) {
		return api.get('pictures/getPicBydir',param)
	},
	deletePicByPath(param) {
		return api.get('pictures/deletePicByPath',param)
	},
	addDir(param) {
		return api.get('pictures/addDir',param)
	},
	clearFiles(param) {
		return api.get('pictures/clearFiles',param)
	},
	deleteDir(param) {
		return api.get('pictures/deleteDir',param)
	},

}