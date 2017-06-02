var connection = require('../dbConnection')

var publicDbUtil = {}



publicDbUtil.getInitParam = function() {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select * from sys_set where name=? or name=? or name=?'
			params = ["logoUrl","title","infor"]
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



publicDbUtil.getNavList = function() {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select * from sys_navlist'
			connection.query(sql,function (error, response) {
				if (error) {
					reject(error)
				} else {
					resolve(response)
				}
			})
		})
	})
}

module.exports = publicDbUtil