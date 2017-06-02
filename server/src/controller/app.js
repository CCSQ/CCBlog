var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
// var cookieParser = require('cookie-parser')
// var session = require('express-session')
var jwt = require('jsonwebtoken')
var expressJWT = require('express-jwt')
var config = require('../config')
var formidable = require('formidable')
var fs = require("fs")
var app = express()

var initDbUtil = require('../dao/init')
var publicDbUtil = require('../dao/public')
var userDbUtil = require('../dao/user')
var articleDbUtil = require('../dao/article')
var setDbUtil = require('../dao/set')
var commentDbUtil = require('../dao/comment')
var picturesServices = require('../services/pictures')

// initDbUtil.init()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// app.use(expressJWT({secret: "CCBlog"}).unless({path:['/user/idIsExist','/user/login','/public/*','/img/*']}))	//验证 jwt 忽略/public

// app.use(function (err, req, res, next) {
	// console.log(req)
// 	if (err.name === 'UnauthorizedError') {
// 		res.status(401).send(false);
// 	}
// })

// app.use(cookieParser('S3CRE7'))
// app.use(session({
// 	secret: 'ccblog_read_only',
// 	name: 'ccblog',
// 	cookie: {maxAge: 20 * 60 * 1000, path: '/' },
// 	resave: false,
// 	saveUninitialized: true,
// }))

// 开放静态资源
app.use(express.static('./server/src/assets'))

// 設置跨域請求
app.use(cors({
	origin: config.origin,
	methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
}))

app.all('*', function(req, res, next) {
// // 	res.header("Access-Control-Allow-Credentials",true) //带cookies
	if (req.url.indexOf('/public') === 0 || req.url.indexOf('/pictures/upload') === 0) {
		next()
	} else {
		if (req.headers.admin) {
			if (req.headers.admin.indexOf("admin") === 0) {
				next()
			}
		} else {
			if (req.headers.authorization) {
				jwt.verify(req.headers.authorization, 'CCBlog', function (err, decoded) {
					if (!decoded) {
						res.status(401).send(false)
					}
					if (decoded.name) {
						if (err) {
							res.status(401).send({msg:"验证失败"})
						} else {
							next()
						}
					} else {
						res.status(401).send(false)
					}
				})
			} else {
				res.status(401).send(false)
			}
		}
		
	}
})

// 获取是否登陆了
app.get('/public/getIsLogin', function (req, res) {
	if (req.headers.admin) {
		if (req.headers.admin.indexOf("admin") === 0) {
			res.send(true)
		}
	} else {
		if (req.headers.authorization) {
			jwt.verify(req.headers.authorization, 'CCBlog', function (err, decoded) {
				if (decoded.name) {
					if (err) {
						res.send(false)
					} else {
						res.send(true)
					}
				} else {
					res.send(false)
				}
			})
		} else {
			res.send(false)
		}
	}
	
})

// 获取是否存在用户名
app.get('/public/idIsExist', function (req, res) {
	userDbUtil.isUserExist(req.query.id).then(function (response) {
		if (response[0].number === 0) {
			res.send(false)
		} else {
			res.send(true)
		}
	})
})

// 登陆
app.post('/public/login', function (req, res) {
	userDbUtil.login(req.body.name,req.body.pwd).then(function (response) {
		if (response[0].number === 0) {
			res.send(false)
		} else {
			// 跨域请求解决
			// req.session.userName = req.body.name
			// req.session.isLogin = true
			// var token = jwt.sign({
			// 	name: req.body.name,
			// 	isLogin: true,
			// }, secret, { expiresInMinutes: 60*5 })
			var token = jwt.sign({name: req.body.name}, "CCBlog")
			res.send(token)
		}
	})
})

// 获取标签（文章类型）
app.get('/article/getArticleType', function (req, res) {
	articleDbUtil.getArticleType().then(function (response) {
		res.send(response)
	})
})

// 增加博文
app.post('/article/addArticle', function (req, res) {
	articleDbUtil.addArticle(req.body).then(function (response) {
		if (!response) {
			res.send("未知文章类型")
			return
		}
		res.send({id: response.insertId})
	},function () {
		res.send("保存失败")
	})
})

// 增加类型
app.post('/article/addArticType', function (req, res) {
	articleDbUtil.addArticType(req.body).then(function (response) {
		res.send(response)
	},function () {
		res.send(false)
	})
})

// 获取所有博文列表（包含可见和非可见）
app.get('/article/getArticleInfor', function (req, res) {
	articleDbUtil.getArticleInfor(req.query).then(function (response) {
		if (!response) {
			res.send("未知文章类型")
			return
		}
		for (var i = response.length - 1; i >= 0; i--) {
			response[i].content = response[i].content.toString()
			response[i].edicValue = response[i].edicValue.toString()
		}
		res.send(response)
	})
})

// 修改博文可见
app.get('/article/updateArticleIsShow', function (req, res) {
	articleDbUtil.updateArticleIsShow(req.query).then(function (response) {
		res.send(response.affectedRows > 0)
	})
})

// 修改分类可见
app.get('/article/changTypeIsShow', function (req, res) {
	articleDbUtil.changTypeIsShow(req.query).then(function (response) {
		res.send(response.affectedRows > 0)
	})
})

// 删除博文
app.get('/article/deleteArticle', function (req, res) {
	articleDbUtil.deleteArticle(req.query).then(function (response) {
		res.send(response.affectedRows > 0)
	})
})

// 删除博文类型
app.get('/article/deleteArtType', function (req, res) {
	if (req.query.value === "none") {
		res.send(response.affectedRows > 0)
		return
	}
	
	articleDbUtil.deleteArtType(req.query).then(function (response) {
		res.send(response.affectedRows > 0)
	})
})

// 获取不同博文类型的数量
app.get('/article/getTypeArtNum', function (req, res) {
	articleDbUtil.getTypeArtNum().then(function (response) {
		res.send(response)
	})
})

// 修改博文
app.post('/article/updateArticle', function (req, res) {
	articleDbUtil.updateArticle(req.body).then(function (response) {
		if (!response) {
			res.send(false)
			return
		}
		res.send(true)
	},function () {
		res.send(false)
	})
})

// 上传图片
app.post('/pictures/upload/:dirName', function (req, res) {
	var form = new formidable.IncomingForm()
	form.uploadDir = "./server/src/assets/img/" + req.params.dirName +"/"
	form.encoding='utf-8'
	form.keepExtensions = true
	form.maxFieldsSize = 10 * 1024 * 1024
	form.parse(req, function(err, fields, files) {
		if (err) {
			res.send({msg:0})
			return
		}
		var extName = ''
		switch (files.file.type) {
			case 'image/pjpeg':
				extName = 'jpg'
				break
			case 'image/jpeg':
				extName = 'jpg'
				break         
			case 'image/png':
				extName = 'png'
				break
			case 'image/x-png':
				extName = 'png'
				break
			case 'image/gif':
				extName = 'gif'
				break
		}
		if (extName.length == 0) {
			fs.unlink(files.file.path,function(err) {
				res.send({msg:1})
			})
			return
		}

		var avatarName = Date.parse(new Date()) + '.' + extName
		var newPath = form.uploadDir + avatarName
		fs.renameSync(files.file.path, newPath)
		res.send(newPath)
	})

	// req.on("data",function(data){
	// 	picturesServices.savePic(req.params.dirName, data)
	// })
	// req.on("end",function(){})
})

// 获取所有图片文件夹
app.get('/pictures/getAllPicDir', function (req, res) {
	picturesServices.getAllPicDir().then(function (response) {
		res.send(response)
	})
})

// 获取文件夹下的图片
app.get('/pictures/getPicBydir', function (req, res) {
	picturesServices.getPicBydir(req.query.dirName).then(function (response) {
		res.send(response)
	})
})

// 删除文件夹下的图片
app.get('/pictures/deletePicByPath', function (req, res) {
	picturesServices.deletePicByPath(req.query.path).then(function (response) {
		res.send(response)
	})
})

// 新建文件夹
app.get('/pictures/addDir', function (req, res) {
	picturesServices.addDir(req.query.dirName).then(function (response) {
		res.send(response)
	})
})

// 清空文件夹
app.get('/pictures/clearFiles', function (req, res) {
	picturesServices.deletePicByPath(req.query.dirName).then(function (response) {
		res.send(response)
	})
})

// 删除文件夹
app.get('/pictures/deleteDir', function (req, res) {
	picturesServices.deleteDir(req.query.dirName).then(function (response) {
		res.send(response)
	})
})

// 获取所有logo图片
app.get('/pictures/getLogoPicList', function (req, res) {
	picturesServices.getLogoPicList().then(function (response) {
		res.send(response)
	})
})

// 上传logo图片
app.post('/pictures/uploadLogo', function (req, res) {
	var form = new formidable.IncomingForm()
	form.uploadDir = "./server/src/assets/logo/"
	form.encoding='utf-8'
	form.keepExtensions = true
	form.maxFieldsSize = 10 * 1024 * 1024
	form.parse(req, function(err, fields, files) {
		if (err) {
			res.send({msg:0})
			return
		}
		var extName = ''
		switch (files.file.type) {
			case 'image/pjpeg':
				extName = 'jpg'
				break
			case 'image/jpeg':
				extName = 'jpg'
				break         
			case 'image/png':
				extName = 'png'
				break
			case 'image/x-png':
				extName = 'png'
				break
			case 'image/gif':
				extName = 'gif'
				break
		}
		if (extName.length == 0) {
			fs.unlink(files.file.path,function(err) {
				res.send({msg:1})
			})
			return
		}

		var avatarName = Date.parse(new Date()) + '.' + extName
		var newPath = form.uploadDir + avatarName
		fs.renameSync(files.file.path, newPath)
		res.send(newPath)
	})
})

// 删除文件夹下的logo图片
app.get('/pictures/delLogoPic', function (req, res) {
	picturesServices.delLogoPic(req.query.imgName).then(function (response) {
		res.send(response)
	})
})

// 设置列表
app.post('/set/setNavList', function (req, res) {
	setDbUtil.setNavList(req.body).then(function (response) {
		res.send(response)
	})
})

// 设置信息
app.post('/set/saveInfor', function (req, res) {
	setDbUtil.saveInfor(req.body).then(function (response) {
		res.send(response)
	})
})


// 设置评论屏蔽
app.get("/comm/setCommIsShow", function (req, res) {
	commentDbUtil.setIsShow(req.query).then(function (response) {
		res.send(response)
	})
})

// 删除屏蔽
app.get("/comm/deleteComm", function (req, res) {
	commentDbUtil.deleteComm(req.query.id).then(function (response) {
		res.send(response)
	})
})



// 无需权限访问
// 获取网站初始化参数
app.get('/public/getInitParam', function (req, res) {
	publicDbUtil.getInitParam().then(function (response) {
		res.send(response)
	})
})

// 获取列表
app.get('/public/getNavList', function (req, res) {
	publicDbUtil.getNavList().then(function (response) {
		res.send(response)
	})
})

// 获取站点数量信息
app.get('/public/getArticNumInfor', function (req, res) {
	articleDbUtil.getArticNumInfor().then(function (response) {
		res.send(response)
	})
})

// 获取文章时间信息
app.get('/public/getArticTime', function (req, res) {
	articleDbUtil.getArticTime(req.query).then(function (response) {
		res.send(response)
	})
})

// 按月份获取文章信息
app.get('/public/getArticListByTime', function (req, res) {
	articleDbUtil.getArticListByTime(req.query).then(function (response) {
		for (var i = response.length - 1; i >= 0; i--) {
			if (response[i].private === 1) {
				response[i].title = "加密文章"
				response[i].tags = ""
				response[i].infor = ""
			}
		}
		res.send(response)
	})
})

// 获取文章信息
app.get('/public/getArticById', function (req, res) {
	articleDbUtil.getArticById(req.query).then(function (response) {
		if (response.length === 0) {
			res.send({})
			return
		}
		if (response[0].private === 1) {
			response[0].title = "加密文章"
			response[0].infor = ""
			response[0].tags = ""
			response[0].content = ""
			response[0].edicValue = ""
		} else {
			response[0].content = response[0].content.toString()
			response[0].edicValue = response[0].edicValue.toString()
			response[0].browseNumber ++
		}
		res.send(response[0])
	})
})

// 获取加密文章信息
app.post('/public/getArticByIdAndPwd', function (req, res) {
	articleDbUtil.getArticByIdAndPwd(req.body).then(function (response) {
		if (response.length !== 0) {
			response[0].content = response[0].content.toString()
			response[0].edicValue = response[0].edicValue.toString()
			response[0].private = 0
			response[0].browseNumber ++
		}
		res.send(response)
	})
})

// 获取浏览用户的昵称
app.get('/public/getBrowNameByEmail', function (req, res) {
	userDbUtil.getBrowNameByEmail(req.query.eMail).then(function (response) {
		if (response.length > 0) {
			res.send(response[0])
		} else {
			res.send(false)
		}
	})
})


// 添加评论
app.post('/public/addComment', function (req, res) {
	userDbUtil.getBrowNameByEmail(req.body.eMail).then(function (response) {
		if (response.length > 0) {
			req.body.id = response[0].ID
			commentDbUtil.addComment(req.body).then(function (response) {
				res.send(response)
			})
			return
		} else {
			userDbUtil.addBrowUser(req.body.eMail, req.body.name).then(function (response) {
				req.body.id = response.insertId
				commentDbUtil.addComment(req.body).then(function (response) {
					res.send(response)
				})
			})
		}
	})
})

// 获取文章评论
app.get('/public/getCommentsByArticId', function (req, res) {
	commentDbUtil.getCommentsByArticId(req.query.ID).then(function (response) {
		// 用户判断
		if (true) {
			response.forEach((item) => {
				if (!item.isShow) {
					item.content = "********"
				}
			})
		}
		res.send(response)
	})
})

// 获取能显示的分类
app.get('/public/getArticShowType', function (req, res) {
	articleDbUtil.getArticShowType().then(function (response) {
		res.send(response)
	})
})

// 获取分类文章数量
app.get('/public/getTypeArtNum', function (req, res) {
	articleDbUtil.getTypeArtNum().then(function (response) {
		res.send(response)
	})
})

// 获取可见文章所有标签
app.get('/public/getAllTags', function (req, res) {
	articleDbUtil.getAllTags().then(function (response) {
		res.send(response)
	})
})

// 按分类查找文章
app.post('/public/searchArtic', function (req, res) {
	articleDbUtil.searchArtic(req.body).then(function (response) {
		res.send(response)
	})
})

// 获取最新文章
app.get('/public/getArticleListLimit', function (req, res) {
	articleDbUtil.getArticleListLimit().then(function (response) {
		res.send(response)
	})
})

// 获取最新评论
app.get('/public/getCommleListLimit', function (req, res) {
	commentDbUtil.getCommleListLimit().then(function (response) {
		res.send(response)
	})
})

// 获取设置
app.get('/public/getParam', function (req, res) {
	setDbUtil.getParam(req.query.list).then(function (response) {
		res.send(response)
	})
})











// 获取列表
app.get('/public/getInforList', function (req, res) {
	console.log(req.query.opts)
	res.send([
		{title: "文章啦啦啦11", time: "22-22-33", infor: "这是666Main", type: "java", id: 1},
		{title: "文章啦啦啦12", time: "23-22-33", infor: "这是666Main", type: "java", id: 2},
		{title: "文章啦啦啦13", time: "24-22-33", infor: "这是666Main", type: "java", id: 3},
		{title: "文章啦啦啦14", time: "25-22-33", infor: "这是666Main", type: "java", id: 4},
		{title: "文章啦啦啦15", time: "26-22-33", infor: "这是666Main", type: "java", id: 5},
		{title: "文章啦啦啦16", time: "27-22-33", infor: "这是666Main", type: "java", id: 6},
		{title: "文章啦啦啦17", time: "28-22-33", infor: "这是666Main", type: "java", id: 7},
		{title: "受保护内容", time: "28-22-33", infor: "", type: "private", isPwd:false, id: 8},
	])
})

// 获取文章
app.get('/article/articleInfor', function (req, res) {
	console.log(req.query)
	console.log(req.session.id)
	// 判断文章是否加密，是加密的现实加密
	// if (!req.session[req.query.id]) {
	if (req.session[req.body.id]) {console.log(req.session[req.body.id])}
	if (!req.session[req.body.id]) {
		res.send({
			isPwd: false,
			title: "受保护内容",
			updateTime: "2013-03-04",
			checkTimes: 100,
			comments: [
				{ ip:"", time:"", cont:"请输入密码后再试" },
			]
		})
		return
	}

	res.send({
		title: "文章标题",
		updateTime: "2013-03-04",
		checkTimes: 100,
		content: "<p>1111</p><h4>demo</h4>",
		comments: [
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
			{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		],
	})
})

// 获取评论列表
app.get('/article/getComments', function (req, res) {
	console.log(req.query)
	res.send([
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
		{ ip:"192.168.1.1", time:"2017-2-15", cont:"服务器习学习zhegewenzihaoduo这个文字好多好多哟111111" },
	])
})

// 增加评论
app.get('/article/addComments', function (req, res) {
	console.log(req.ip)
	console.log(req.query)

	res.send(true)
})

// 获取文章列表信息
app.post('/private/getPrivateInfor', function (req, res) {
	console.log(req.body)

	if (req.body.pwd == '123') {
		res.send(['文章标题','文章部分信息'])
	} else {
		res.send(false)
	}
})

// 获取加密文章信息
app.post('/private/getPrivateArticInfor', function (req, res) {
	console.log(req.body)

	console.log(req.session.id)

	if (req.body.pwd == '123') {
		req.session[req.body.id] = true
		res.send(true)
	} else {
		res.send(false)
	}
})


app.get('/test/demo', function (req, res) {
	console.log(req.query)
	console.log(req.session.id)
	if (req.session[req.query.id]) {
		console.log(req.session[req.query.id])
	} else {
		req.session[req.query.id] = '1111'
	}
	

	res.send(true)
})


app.get('/test2/demo', function (req, res) {
	console.log(req.query)
	console.log(req.session)
	if (req.session[req.query.id]) {
		console.log(req.session[req.query.id])
	} else {
		req.session[req.query.id] = '1111'
	}
	

	res.send(true)
})


var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port

	console.log('Example app listening at http://%s:%s', host, port)
})