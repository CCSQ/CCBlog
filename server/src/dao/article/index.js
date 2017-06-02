// sys_article 文章
// sys_article_type 文章类型
var connection = require('../dbConnection')
var util = require('../../util')
var articleDbUtil = {}

articleDbUtil.getArticleType = function() {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select type as value, name as name, isShow from sys_article_type'
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

articleDbUtil.getArticShowType = function(param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select type, name from sys_article_type where isShow=1'
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

articleDbUtil.changTypeIsShow = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'update sys_article_type set isShow=? where type=?'
			var params = [param.isShow, param.value]
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

articleDbUtil.isArticleTypeExist = function(type) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select count(*) as number from sys_article_type where type=?'
			params = [type]
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

articleDbUtil.isArticleNameExist = function(name) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select count(*) as number from sys_article_type where name=?'
			params = [name]
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

articleDbUtil.addArticType = function(param) {
	return this.isArticleNameExist(param.name).then(function (response) {
		if (response[0].number === 0) {
			return new Promise(function (resolve, reject) {
				connection.connect(function () {

					var sql = 'insert into sys_article_type(ID,type,name,isShow) values(?,?,?,?)'
					var value = Date.parse(new Date())
					params = [0,value,param.name,param.isShow ? 1 : 0]
					connection.query(sql,params,function (error, response) {
						if (error) {
							reject(false)
						} else {
							response.value = value
							resolve({value: value})
						}
					})
				})
			})
		} else {
			return new Promise(function (resolve, reject) {
				resolve(false)
			})
		}
	})
}

articleDbUtil.getTypeArtNum = function() {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select count(*) as number, type from sys_article GROUP BY type'
			connection.query(sql,function (error, response) {
				if (error) {
					reject(false)
				} else {
					resolve(response)
				}
			})
		})
	})
}

articleDbUtil.addArticle = function(param) {
	return this.isArticleTypeExist(param.type).then(function (response) {
		if (response[0].number === 0) {
			return new Promise(function (resolve, reject) {
				resolve(false)
			})
		} else {
			return new Promise(function (resolve, reject) {
				connection.connect(function () {

					var sql = 'insert into sys_article(ID,type,createTime,updateTime,password,private,infor,content,title,lastRely,relyNumber,browseNumber,tags,isShow,edicValue) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
					var nowTime = new Date()
					var private = param.private == "false" ? 0 : 1
					var isShow = param.isShow == "false" ? 0 : 1
					var pwd = param.pwd == ""? "" : util.string2md5(param.pwd)
					var tag = param.tags ? param.tags.join(",") : ""
					params = [0,param.type,nowTime,nowTime,pwd,private,param.infor,param.content,param.title,0,0,0,tag,isShow,param.edicValue]
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
	})
}

articleDbUtil.getArticleInfor = function(param) {
	var sqlParam = param.param
	if (sqlParam.type != "") {
		return this.isArticleTypeExist(param.param.type).then(function (response) {
			if (response[0].number === 0) {
				return new Promise(function (resolve, reject) {
					resolve(false)
				})
			} else {
				return new Promise(function (resolve, reject) {
					connection.connect(function () {

						var sql = 'select * from sys_article where type = ? ORDER BY '
						// 创建时间排序
						if (sqlParam.time) {
							sql += ' createTime,'
						} else {
							sql += ' createTime DESC,'
						}
						// 浏览量排序
						if (sqlParam.browse) {
							sql += ' browseNumber,'
						} else {
							sql += ' browseNumber DESC,'
						}
						// 回复量排序
						if (sqlParam.reply) {
							sql += ' relyNumber,'
						} else {
							sql += ' relyNumber DESC,'
						}
						// 最后回复时间
						if (sqlParam.lastReply) {
							sql += ' lastRely'
						} else {
							sql += ' lastRely DESC'
						}
						sql += ' limit ?, ?'
						params = [sqlParam.type,parseInt(param.start),parseInt(param.length)]
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
		})
	} else {
		return new Promise(function (resolve, reject) {
			connection.connect(function () {

				var sql = 'select * from sys_article ORDER BY '
				// 创建时间排序
				if (sqlParam.time === "false") {
					sql += ' createTime,'
				} else {
					sql += ' createTime DESC,'
				}
				// 浏览量排序
				if (sqlParam.browse === "false") {
					sql += ' browseNumber,'
				} else {
					sql += ' browseNumber DESC,'
				}
				// 回复量排序
				if (sqlParam.reply === "false") {
					sql += ' relyNumber,'
				} else {
					sql += ' relyNumber DESC,'
				}
				// 最后回复时间
				if (sqlParam.lastReply === "false") {
					sql += ' lastRely'
				} else {
					sql += ' lastRely DESC'
				}

				sql += ' limit ?, ?'
				console.log(sql)
				params = [parseInt(param.start),parseInt(param.length)]
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
}

articleDbUtil.updateArticleIsShow = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var isShow = param.isShow == "false" ? 0 : 1
			var sql = 'update sys_article set isShow=? where ID=?'
			params = [isShow,parseInt(param.id)]
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

articleDbUtil.deleteArticle = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'delete from sys_article where ID=?'
			params = [parseInt(param.id)]
			connection.query(sql,params,function (error, response) {
				if (error) {
					reject(error)
				} else {
					resolve(response)
					// 删除评论操作
				}
			})
		})
	})
}

articleDbUtil.changArticleTypeToDefault = function(changType) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'update sys_article set type="none" where type=?'
			params = [changType]
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

articleDbUtil.deleteArtType = function (param) {
	return this.changArticleTypeToDefault(param.value).then(function (response) {
		// 判断异常情况！！！！
		return new Promise(function (resolve, reject) {
			connection.connect(function () {
				var sql = 'delete from sys_article_type where type=?'
				params = [param.value]
				connection.query(sql,params,function (error, response) {
					if (error) {
						reject(error)
					} else {
						resolve(response)
					}
				})
			})
		})
	})
}

articleDbUtil.updateArticle = function(param) {
	return this.isArticleTypeExist(param.type).then(function (response) {
		if (response[0].number === 0) {
			return new Promise(function (resolve, reject) {
				resolve(false)
			})
		} else {
			return new Promise(function (resolve, reject) {
				connection.connect(function () {
					var sql = 'update sys_article set type=?, updateTime=? ,password=?,private=?,infor=?,content=?,title=?,tags=?,isShow=?,edicValue=? where Id=?'
					var nowTime = new Date()
					var private = param.private === "false" ? 0 : 1
					var isShow = param.isShow === "false" ? 0 : 1
					var pwd = param.pwd === ""? "" : util.string2md5(param.pwd)
					var tag = param.tags ? param.tags.join(",") : ""
					params = [param.type,nowTime,pwd,private,param.infor,param.content,param.title,tag,isShow,param.edicValue,param.id]
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
	})
}

articleDbUtil.getArticNumInfor = function (param) {
	
	return new Promise(function (resolve, reject) {
		var temp
		connection.connect(function () {
			var sql = 'select * from sys_article_type where isShow=1'
			connection.query(sql,function (error, response) {
				if (error) {
					reject(error)
				} else {
					temp = response
				}
			})

			sql = 'select tags from sys_article where isShow=1'
			connection.query(sql,function (error, response) {
				if (error) {
					reject(error)
				} else {
					response.push(temp)
					resolve(response)
				}
			})
		})
	})
}

articleDbUtil.getArticTime = function (param) {
	
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			// console.log(param)
			var sql = 'select createTime from sys_article where isShow=1 and type=?'
			var params = [param.type]
			if (param.type === "all") {
				sql = 'select createTime from sys_article where isShow=1'
				params = []
			}
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

articleDbUtil.getArticListByTime = function (param) {
	
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			// console.log(param)
			var sql = 'select ID,browseNumber,infor,lastRely,private,relyNumber,tags,title,createTime from sys_article where type=? and DATE_FORMAT(createTime,"%Y%c")=? and isShow=1'
			var params = [param.type,param.year+""+param.month]
			if (param.type === "all") {
				sql = 'select ID,browseNumber,infor,lastRely,private,relyNumber,tags,title,createTime from sys_article where DATE_FORMAT(createTime,"%Y%c")=? and isShow=1'
				params = [param.year+""+param.month]
			}
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

articleDbUtil.searchArtic = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			// console.log(param)
			var sql = 'select ID,browseNumber,infor,lastRely,private,relyNumber,tags,title,createTime from sys_article where isShow=1 and private=0'
			// var params = []
			if (param.tag !== "0") {
				sql += ' and tags like "%' + param.tag + '%"'
				// params.push(param.tag)
			}

			if (param.titleKey !== "0") {
				sql += ' and title like "%' + param.titleKey + '%"'
				// params.push(param.titleKey)
			}

			console.log(sql)
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

articleDbUtil.getArticById = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var params = [param.ID]
			var sql = 'select * from sys_article where ID=? and isShow=1'
			connection.query(sql,params,function (error, response) {
				if (error) {
					reject(error)
				} else {
					if (response.length !== 0) {
						if (response[0].private === 0) {
							sql = 'update sys_article set browseNumber=browseNumber+1 where ID=? and isShow=1'
							connection.query(sql,params)
						}
					}
					resolve(response)
				}
			})
		})
	})
}

articleDbUtil.getArticByIdAndPwd = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select * from sys_article where ID=? and password=? and isShow=1'
			var params = [param.ID, util.string2md5(param.pwd)]
			connection.query(sql,params,function (error, response) {
				if (error) {
					reject(error)
				} else {
					if (response.length !== 0) {
						sql = 'update sys_article set browseNumber=browseNumber+1 where ID=? and isShow=1'
						params = [param.ID]
						connection.query(sql,params)
					}
					resolve(response)
				}
			})
		})
	})
}

articleDbUtil.getAllTags = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select tags from sys_article where isShow=1 and private=0'
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


articleDbUtil.getArticleListLimit = function (param) {
	return new Promise(function (resolve, reject) {
		connection.connect(function () {
			var sql = 'select ID,title from sys_article where isShow=1 and private=0 ORDER BY createTime DESC limit 0,5'
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

module.exports = articleDbUtil