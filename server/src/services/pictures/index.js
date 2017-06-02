// 图片服务
var fs = require("fs")
var picturesServices = {}

picturesServices.getAllPicDir = function() {
	return new Promise(function (resolve, reject) {
		fs.readdir("./server/src/assets/img/",function(err, files){
			if (err) {
				reject(err)
			}
			var dirList = []
			if (!files) {
				resolve(dirList)
			}
			files.forEach(function (file){
				var stats = fs.statSync('./server/src/assets/img/' + file)
				if (stats.isDirectory()) {
					dirList.push(file)
				}
			})
			resolve(dirList)
		})
	})
}

picturesServices.getPicBydir = function(dirName) {
	return new Promise(function (resolve, reject) {
		fs.readdir("./server/src/assets/img/" + dirName + "/",function(err, files){
			if (err) {
				reject(err)
			}
			var imgList = []
			if (!files) {
				resolve(dirList)
			}
			files.forEach(function (file){
				var stats = fs.statSync("./server/src/assets/img/" + dirName + "/" + file)
				if (stats.isFile()) {
					imgList.push(file)
				}
			})
			resolve(imgList)
		})
	})
}

picturesServices.deletePicByPath = function(path) {
	return new Promise(function (resolve, reject) {
		fs.unlink("./server/src/assets/img/" + path, function(err) {
			if (err) {
				reject(false)
			}
			resolve(true)
		})
	})
}

picturesServices.deleteDir = function(dirName) {
	return this.clearFiles(dirName).then(function (response) {
		if (response) {
			return new Promise(function (resolve, reject) {
				fs.rmdir("./server/src/assets/img/" + dirName, function(err) {
					if (err) {
						reject(false)
					}
					resolve(true)
				})
			})
		} 
	})
}

picturesServices.clearFiles = function(dirName) {
	var that = this
	return new Promise(function (resolve, reject) {
		fs.readdir("./server/src/assets/img/" + dirName + "/",function(err, files){
			if (err) {
				reject(err)
			}
			if (!files) {
				resolve({mag: true})
			}
			files.forEach(function (file){
				that.deletePicByPath(dirName + "/" + file)
			})
			resolve({mag: true})
		})
	})
}

picturesServices.savePic = function (dirName, data) {
	return new Promise(function (resolve, reject) {
		// console.log(data)
	})
}

picturesServices.addDir = function (dirName) {
	return new Promise(function (resolve, reject) {
		fs.mkdir("./server/src/assets/img/" + dirName + "/",function(err){
			if (err) {
				reject(false)
			}
			resolve(true)
		})
	})
}

picturesServices.getLogoPicList = function() {
	return new Promise(function (resolve, reject) {
		fs.readdir("./server/src/assets/logo/",function(err, files){
			if (err) {
				reject(err)
			}
			var imgList = []
			if (!files) {
				resolve(dirList)
			}
			files.forEach(function (file){
				var stats = fs.statSync("./server/src/assets/logo/" + file)
				if (stats.isFile()) {
					imgList.push(file)
				}
			})
			resolve(imgList)
		})
	})
}

picturesServices.delLogoPic = function(imgName) {
	return new Promise(function (resolve, reject) {
		fs.unlink("./server/src/assets/logo/" + imgName, function(err) {
			if (err) {
				reject(false)
			}
			resolve(true)
		})
	})
}

module.exports = picturesServices