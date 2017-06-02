// sys_user
var connection = require('../dbConnection')
var util = require('../../util')
var userDbUtil = {}

userDbUtil.isUserExist = function(userName) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select count(*) as number from sys_user where loginName=?'
			params = [userName]
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

userDbUtil.login = function (userName, password) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select count(*) as number from sys_user where loginName=? and passWord=?'
			params = [userName,util.string2md5(password)]
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

userDbUtil.getBrowNameByEmail = function (eMail) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select * from sys_brow_user where eMain=?'
			params = [eMail]
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

userDbUtil.addBrowUser = function (eMail, name) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'insert into sys_brow_user(ID,eMain,name) values (0,?,?)'
			params = [eMail,name]
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

module.exports = userDbUtil