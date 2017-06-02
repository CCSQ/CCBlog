// sys_article 文章
// sys_article_type 文章类型
var connection = require('../dbConnection')
var util = require('../../util')
var commentDbUtil = {}

commentDbUtil.addComment = function(param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'update sys_article set lastRely=?,relyNumber=relyNumber+1 where ID=?'
			var params = [new Date(), param.articleId,]
			connection.query(sql,params,function (error, response) {
				if (error) {
					reject(error)
				} else {
					if (response.affectedRows > 0 || param.articleId === "0") {
						sql = 'insert into sys_comment(ID,content,articId,rePlayId,userId,createTime) values (0,?,?,?,?,?)'
						params = [param.content,param.articleId,param.replayId,param.id,new Date()]
						connection.query(sql,params,function (error, response) {
							if (error) {
								reject(error)
							} else {
								resolve(response)
							}
						})
					} else {
						resolve({msg:false})
					}
				}
			})
			
		})
	})
}

commentDbUtil.getCommentsByArticId = function(ID) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select com.*,user.name from sys_comment as com, sys_brow_user as user where com.articId=? and com.userId=user.ID'
			var params = [ID]
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

commentDbUtil.getCommleListLimit = function(ID) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select comm.articId,comm.content from sys_comment as comm, sys_article as art where art.isShow=1 and comm.isShow=1 and art.private=0 and art.ID=comm.articId and comm.rePlayId=0 ORDER BY comm.createTime DESC limit 0,5'
			var params = [ID]
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

commentDbUtil.setIsShow = function(param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'update sys_comment set isShow=? where ID=?'
			var params = [param.isShow, param.id]
			connection.query(sql,params,function (error, response) {
				if (error) {
					reject({msg: false})
				} else {
					if (response.affectedRows) {
						resolve({msg: true})
					} else {
						resolve({msg: false})
					}
				}
			})
		})
	})
}

commentDbUtil.deleteComm = function(id) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'delete from sys_comment where ID=?'
			var params = [id]
			connection.query(sql,params,function (error, response) {
				if (error) {
					reject({msg: false})
				} else {
					if (response.affectedRows) {
						resolve({msg: true})
					} else {
						resolve({msg: false})
					}
				}
			})
		})
	})
}

module.exports = commentDbUtil