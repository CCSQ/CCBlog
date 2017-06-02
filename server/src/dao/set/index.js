var connection = require('../dbConnection')

var setDbUtil = {}



setDbUtil.setNavList = function(param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'delete from sys_navlist;'
			connection.query(sql)
			sql = 'INSERT INTO sys_navlist(ID,pageName,pagType,linkName) VALUES'
			var params = []
			for (var par in param) {
				sql += '(0,?,?,?),'
				params.push(param[par].pageName)
				params.push(param[par].pagType)
				params.push(param[par].linkName)
			}

			sql = sql.substring(0,sql.lastIndexOf(',')) + ';'

			// console.log(sql, params)
			
			// connection.beginTramsaction()
			connection.query(sql,params,function (error, response) {
				if (error) {
					reject(error)
				} else {
					resolve(true)
				}
			})
		})
	})
}

setDbUtil.saveInfor = function(param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'delete from sys_set where '
			// console.log(param)
			var params = []
			for(var par in param) {
				sql += 'name=? or '
				params.push(par)
			}
			sql = sql.substring(0,sql.lastIndexOf(' or ')) + ';'
			connection.query(sql,params)

			sql = 'INSERT INTO sys_set(ID,name,param) VALUES'
			params = []
			for (var par in param) {
				sql += '(0,?,?),'
				params.push(par)
				params.push(param[par])
			}

			sql = sql.substring(0,sql.lastIndexOf(',')) + ';'

			connection.query(sql,params,function (error, response) {
				if (error) {
					reject(error)
				} else {
					resolve(true)
				}
			})
		})
	})
}

setDbUtil.getParam = function(param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select * from sys_set where '
			// console.log(param)
			var params = []
			for (var i = param.length - 1; i >= 0; i--) {
				sql += 'name=? or '
				params.push(param[i])
			}
			sql = sql.substring(0,sql.lastIndexOf(' or ')) + ';'

			connection.query(sql,params,function (error, response) {
				if (error) {
					reject(error)
				} else {
					resolve(response)
				}
			})
		})
	})
}


module.exports = setDbUtil