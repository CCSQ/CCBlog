<template>
	<div class="article">
		<el-card class="well" :body-style="{ padding: '0px' }">
			<div slot="header">
				<h3>
					{{ article.title }}
				<el-tag type="primary" v-for="tag in formatTags(article.tags)" >{{ tag }}</el-tag>
				</h3>
				
				<span>
					<i class="el-icon-date"> {{ article.createTime | formatTime }}</i> / 
					<span>浏览：{{ article.browseNumber }}</span> ／ 
					<span>回复：{{ article.relyNumber }}</span>
				</span>
			</div>

			<div class="content" v-if="article.private === 0">
				<div v-html="article.content"></div>
			</div>
			<div class="content" v-else>
				<el-form :inline="true" :model="pwdObj" :rules="rules" ref="pwd">
					<el-form-item prop="pwd">
						<el-input type="password" v-model="pwdObj.pwd" placeholder="输入密码以查看" icon="warning"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="sublimePwd(pwdObj)">提交</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div class="car-foot" v-show="article.private === 0">
				<h3>评论</h3>
				<div v-for="(item, commIndex) in commentsList">
					<div class="comment-item">
						<el-row :gutter="20" class="row">
							<el-col :span="1">#{{ commIndex + 1 }}</el-col>
							<el-col :span="7">{{ item.name }} | {{ item.createTime | formatTime }}</el-col>
							<el-col :span="3" :offset="13" class="resplay"><el-button type="primary" size="mini" @click="replayComm(item)">回复</el-button></el-col>
						</el-row>
						<p class="comment-con">{{ item.content }}</p>
					</div>


					<div class="replay comment-item" v-for="(childItem, childIndex) in item.child">
						<el-row :gutter="20" class="row">
							<el-col :span="2" :offset="2">#{{ commIndex + 1 }}-{{ childIndex + 1 }}</el-col>
							<el-col :span="6">{{ childItem.name }} | {{ childItem.createTime | formatTime }}</el-col>
							<!-- <el-col :span="6">{{ childItem.name }} to {{ childItem.replayName }} | {{ childItem.createTime | formatTime }}</el-col> -->
							<el-col :span="3" :offset="11" class="resplay"><el-button type="primary" size="mini" @click="replayComm(childItem)">回复</el-button></el-col>
						</el-row>
						<p class="comment-con">{{ childItem.content }}</p>
					</div>
					

				</div>
			</div>

			<div class="car-replay" v-show="article.private === 0">
				<h3>{{ replayHeard }} <el-button type="primary" size="mini" @click="cancel" v-show='replayHeard !== "发表评论"'>取消</el-button></h3>

				<el-form :model="comments" :rules="rules" ref="contentText">
					<el-form-item prop="content">
						<el-input type="textarea" v-model="comments.content" placeholder="评论"></el-input>
					</el-form-item>
				</el-form>
				<el-form :inline="true" :model="comments" :rules="rules" ref="content">
					<!-- <textarea placeholder="评论"></textarea> -->
					<el-form-item prop="eMail">
						<!-- <el-input v-model="comments.eMail" placeholder="邮箱" icon="message"></el-input> -->
						<el-autocomplete v-model="comments.eMail" placeholder="邮箱" icon="message" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="getTheUaerName(comments.eMail)"></el-autocomplete>
					</el-form-item>
					<el-form-item prop="name">
						<el-input v-model="comments.name" placeholder="昵称" icon="edit"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="sublime(comments)">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>


		<!-- <div class="well panel radius"> -->
			<!-- 文章标题 -->
			<!-- <div class="title">
				<h3>{{ articleInfor.title }}</h3>
				<small> · 最后修改时间：{{ articleInfor.updateTime }} · 点击量：{{ articleInfor.checkTimes }}</small>
			</div>
			<div v-if="false == articleInfor.isPwd">
				<div class="row collapse postfix-radius private-pwd">
					<div class="small-9 columns"><input type="password" placeholder="输入密码查看内容" id="pwd"></div>
					<div class="small-3 columns"><a href="javascript:void(0);" class="button postfix" @click="submitPwd()">提交</a></div>
				</div>
			</div>
			<div v-else class="articCont">
				<div v-html="articleInfor.content"></div>
			</div>
		</div>

		<div class="well panel radius">
			<div class="title">
				<span class="gray">{{ articleInfor.comments.length }} 回复 <strong> | </strong> 截至 {{ articleInfor.comments[articleInfor.comments.length - 1].time }} </span>
			</div>

			<div class="all-comments">
				<div v-for="(item ,index) in articleInfor.comments" class="comments panel">
					<span class="label secondary">{{ index + 1 }}</span>
					<strong class="ip">ip: {{ item.ip }}</strong>  <small>{{ item.time }}</small>
					<div class="cont">{{ item.cont }}</div>
				</div >
			</div>
		</div>

		<div class="well panel radius">
			<div class="title">
				<span class="gray">添加新评论</span>
			</div>

			<div class="commentsEd">
				<textarea placeholder="评论" v-model="comments.content"></textarea>
				<button type="button" class="button tiny" @click="submitComment()" data-reveal-id="modal">提交</button>
			</div>
		</div> -->

	</div>

</template>

<script>

import articleServer from '../../services/article'
import usererver from '../../services/user'
import commentserver from '../../services/comments'
import highlight from 'highlight.js'
export default {
	name: 'article',
	data () {
		return {
			pwdObj: {
				pwd: "",
			},
			article: {
				tags: "",
			},
			replayHeard: "发表评论",
			comments: {
				articleId: this.$route.params.ID,
				id: -1,
				content: "",
				eMail: "",
				name: "",
				replayId: 0,
			},

			rules: {
				content: [
					{ required: true, message: '请输入评论内容', trigger: 'blur' },
				],
				eMail:[
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
				],
				name: [
					{ required: true, message: '请输入昵称', trigger: 'blur' },
				],
				pwd: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
				],
			},

			// 评论列表
			commentsList: [],
			// articleInfor: {
			// 	title: "",
			// 	updateTime: "0",
			// 	checkTimes: 0,
			// 	content: "",
			// 	comments: [{ ip:"", time:0, cont:"" },],
			// },
			// 	content: "",
			// 	articleId: this.$route.params.articleId,
			// },

			// start: 12,
			// leng: 12,
		}

	},

	mounted: function() {
		articleServer.getArticById({ID: this.$route.params.ID}).then((res) => {
			this.article = res.body
			if (this.article.private === 0) {
				this.getComments()
			}
			window.setTimeout(() => {
				this.updateCodeStyle()
			}, 10)
		})

		
	},

	watch: {
		'$route'(to, from) {
			articleServer.getArticById({ID: to.params.ID}).then((res) => {
				this.article = res.body
				if (this.article.private === 0) {
					this.getComments()
				}
				window.setTimeout(() => {
					this.updateCodeStyle()
				}, 10)
			})
		},
	},

	methods: {
		sublime: function (comments) {
			var flag = true
			this.$refs["contentText"].validate((valid) => {
				if (!valid) {
					flag = false
					return false
				}
			})
			
			this.$refs["content"].validate((valid) => {
				if (valid) {
					if (!flag) return
					commentserver.addComment(comments).then((res) => {
						if (res.body.affectedRows) {
							this.article.relyNumber ++
							this.$message({
								message: '评论提交成功',
								type: 'success',
							})

							var obj = $.extend(true, {}, comments)
							comments.content = ""
							obj.ID = res.body.insertId
							obj.createTime = new Date()
							obj.rePlayId = obj.replayId

							if (comments.replayId === 0) {
								obj.child = []
								this.commentsList.push(obj)
								this.commentsList.sort(function (a,b) {
									return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
								})
							} else {
								for (var i = this.commentsList.length - 1; i >= 0; i--) {
									if(this.commentsList[i].ID === comments.replayId){
										obj.replayName = this.commentsList[i].name
										this.commentsList[i].child.push(obj)
										this.commentsList[i].child.sort(function (a,b) {
											return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
										})
										return
									} else {
										for (var j = this.commentsList[i].child.length - 1; j >= 0; j--) {
											if(this.commentsList[i].child[j].ID === comments.replayId){
												obj.replayName = this.commentsList[i].child[j].name
												// obj.replayIndex = j + 1
												this.commentsList[i].child.push(obj)
												this.commentsList[i].child.sort(function (a,b) {
													return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
												})
												return
											}
										}
									}
								}
							}
							console.log(this.commentsList)
						} else {
							this.$message({
								message: '提交失败',
								type: 'error',
							})
						}
					})
				} else {
					return false
				}
			})
		},

		replayComm: function (item) {
			console.log(item)
			this.comments.replayId = item.ID
			this.replayHeard = "回复" + item.name 
		},

		cancel: function () {
			this.comments.replayId = 0
			this.replayHeard = "发表评论"
		},

		querySearch: function (queryString, cb) {
			var restaurants = []
			if (queryString.lastIndexOf("@") === -1) {
				restaurants = [
					{ "value": queryString + "@qq.com" },
				]
			} else if (queryString.lastIndexOf("@") === (queryString.length - 1)) {
				restaurants = [
					{ "value": queryString + "qq.com" },
				]
			}
			cb(restaurants)
		},

		getTheUaerName: function (eMail) {
			usererver.getBrowNameByEmail({eMail:eMail}).then((res) => {
				if (res.body) {
					this.comments.name = res.body.name
					this.comments.id = res.body.ID
				} else {
					// this.comments.name = ""
					this.comments.id = 0
				}
			})
		},

		formatTags: function(value) {
			if (value === "") {
				return []
			}
			return value.split(",")
		},

		updateCodeStyle: function () {
			$('pre code').each(function (i, block) {
				highlight.highlightBlock(block)
			})


			$('.hljs').each(function (i, item) {
				let $this = $(item)
				let matchLang = $this.attr('class').match(/lang\-[a-z]+/)
				let language = matchLang ? matchLang[0].split('-')[1] : 'code'
				$this.attr('data-language', language)
			})

			$('a').attr('target', '_blank')
		},


		getComments: function () {
			commentserver.getCommentsByArticId({ID: this.$route.params.ID}).then((res) => {
				// this.article = res.body
				res.body.sort(function (a,b) {
					return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
				})
				for (var i =  0; i < res.body.length; i++) {
					if(res.body[i].rePlayId === 0) {
						res.body[i].child = []
						this.commentsList.push(res.body[i])
					} else {
						for (var j = this.commentsList.length - 1; j >= 0; j--) {
							if(this.commentsList[j].ID === res.body[i].rePlayId){
								res.body[i].replayName = this.commentsList[j].name
								this.commentsList[j].child.push(res.body[i])
								break
							} else {
								for (var k = this.commentsList[j].child.length - 1; k >= 0; k--) {
									if(this.commentsList[j].child[k].ID === res.body[i].rePlayId){
										res.body[i].replayName = this.commentsList[j].child[k].name
										this.commentsList[j].child.push(res.body[i])
										break
									}
								}
							}
						}
					}
				}

				for (var i = this.commentsList.length - 1; i >= 0; i--) {
					this.commentsList[i].child.sort(function (a,b) {
						return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
					})
					// for (var j = this.commentsList[i].child.length - 1; j >= 0; j--) {
					// 	this.commentsList[i].child[j].replayIndex = j + 1
					// }
				}

				this.commentsList.sort(function (a,b) {
					return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
				})
			})
		},

		sublimePwd: function (pwdObj) {
			console.log(pwdObj)

			articleServer.getArticByIdAndPwd({ID: this.$route.params.ID, pwd: pwdObj.pwd}).then((res) => {
				if (res.body.length === 0) {
					this.$message({
						message: '密码验证失败！',
						type: 'error',
					})
					return
				}
				this.article = res.body[0]
				this.getComments()
				window.setTimeout(() => {
					this.updateCodeStyle()
				}, 10)
			})
		}

		

		// submitComment: function() {
		// 	if (this.comments.content == "") {
		// 		alert("请输入评论内容")
		// 		return
		// 	}
		// 	articleServer.addComments(this.comments)
		// },

		// getComments: function () {
		// 	var that = this
		// 	articleServer.getComments({start: this.start, leng: this.leng, id: this.comments.articleId})
		// 	.then(function (res) {
		// 		// that.articleInfor.comments.concat(res.body)
		// 		for (var i = 0; i < res.body.length; i++) {
		// 			that.articleInfor.comments.push(res.body[i])
		// 		}
		// 	})
		// },

		// getArticleInfor: function () {
		// 	var that = this
		// 	articleServer.getArticleInfor({id:this.comments.articleId, initCommLeng: this.start})
		// 	.then(function (res) {
		// 		that.articleInfor = res.body
		// 	})
		// },

		// submitPwd: function () {
		// 	var that = this
		// 	if ($("#pwd").val() == "") {
		// 		alert("请输入密码后再试")
		// 		return
		// 	}
		// 	articleServer.getPrivateArticInfor({id: this.comments.articleId, pwd: $("#pwd").val()})
		// 	.then(function (res) {
		// 		if (res.body) {
		// 			// that.getArticleInfor()
		// 		} else {
		// 			alert("密码错误")
		// 		}
		// 	})
		// }
	},

	filters: {
		// 格式化时间
		formatTime: function (value) {
			var date = new Date(value)
			return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.well {
	margin-left: 20px;
	margin-right: 20px;
	border-radius: 5px;
	box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
	background: #fff;
}

h3 {
	box-sizing: border-box;
	width: 100%;
	height: 40px;
	line-height: 55px;
	font-size: 20px;
	font-weight: normal;
	padding: 0 30px;
	margin: 0;
	/*border-bottom: 1px solid #eee;*/
}

.well span {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
}

.car-foot {
	border-top: 1px solid #d1dbe5;
	padding: 20px;
}

.car-replay {
	/*border-top: 1px solid #d1dbe5;*/
	padding: 20px;
	padding-top: 5px;
}

.content {
	padding: 20px;
}

.row {
	border-bottom: 1px solid #d1dbe5;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
	margin-top: 15px;
}

.comment-con {
	margin: 0px 20px;
}

.resplay {
	display: none;
}

.comment-item:hover .resplay {
	display: block;
}

.replay .comment-con {
	margin-left: 10%;
}


/*textarea {
	resize:none;
	height: 130px;
	width: 100%;
	font-size: 15px;
	border-radius: 5px;
	border-color: #d1dbe5;
}*/











/*.article {
	box-sizing: border-box;
	margin-top: 40px; 
	margin-left: auto;
	margin-right: auto;
}*/

.title {
	box-sizing: border-box;
	width: 100%;
	/*height: 40px;*/
	/*line-height: 55px;*/
	font-size: 20px;
	font-weight: normal;
	color: rgba(0, 0, 0, 0.4);
	padding: 0 30px;
	margin: 0;
	border-bottom: 1px solid #eee;
}

.gray {
	font-size: 8px;
}

.comments {
	box-sizing: border-box;
	width: 100%;
	/*height: 40px;*/
	/*line-height: 55px;*/
	font-size: 20px;
	font-weight: normal;
	color: rgba(0, 0, 0, 0.4);
	padding: 0 30px;
	margin: 0;
	border-bottom: 1px solid #eee;
	background-color: #fff;
	border-top: 0px;
	border-right: 0px;
	border-left: 0px;
}

.all-comments {
	overflow:scroll;
	width: 100%;
	height: 600px;
	overflow:hidden;
	overflow-y:yes;
	overflow-y:auto;
}

.ip {
	margin-top: 5px;
	font-size: 8px;
}

.cont {
	font-size: 15px;
	color: #000;
	margin-left: 20px;
	margin-right: 20px;
}

.label {
	float: right;
	top: 18px;
	right: 0px;
}

.commentsEd{
	margin-top: 10px;
}

.commentsEd textarea {
	resize:none;
	height: 130px;
}


/*修改滚动条样式*/
::-webkit-scrollbar {
	width: 3px;
}
 
/* Track */
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
	-webkit-border-radius: 10px;
	border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
	-webkit-border-radius: 10px;
	border-radius: 10px;
	background: rgba(7,7,7,0.8); 
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
}
::-webkit-scrollbar-thumb:window-inactive {
	background: rgba(7,7,7,0.4); 
}

.container {
	width: 300px;
	height: 300px;
	background-color: #DCDCDC;
	overflow: scroll; /* showing scrollbars */
}

.dark .container {
	overflow: hidden; /* showing scrollbars */
}




</style>
