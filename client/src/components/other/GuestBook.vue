<template>
	<div class="guestBook">
		<el-card class="well" :body-style="{ padding: '0px' }">
			<div slot="header">
				<h3>留言板</h3>
			</div>

			<div class="car-foot" v-if="commentsList.length !== 0">
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
			<div v-else class="car-foot">
				<span>暂无留言</span>
			</div>


			<div class="car-replay">
				<h3>{{ replayHeard }} <el-button type="primary" size="mini" @click="cancel" v-show='replayHeard !== "发表留言"'>取消</el-button></h3>

				<el-form :model="comments" :rules="rules" ref="contentText">
					<el-form-item prop="content">
						<el-input type="textarea" v-model="comments.content" placeholder="留言"></el-input>
					</el-form-item>
				</el-form>
				<el-form :inline="true" :model="comments" :rules="rules" ref="content">
					<el-form-item prop="eMail">
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
	</div>



</template>

<script>
import usererver from '../../services/user'
import commentserver from '../../services/comments'
export default {
	name: 'guestBook',
	data () {
		return {
			replayHeard: "发表留言",
			comments: {
				articleId: 0,
				id: -1,
				content: "",
				eMail: "",
				name: "",
				replayId: 0,
			},

			rules: {
				content: [
					{ required: true, message: '请输入留言内容', trigger: 'blur' },
				],
				eMail:[
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
				],
				name: [
					{ required: true, message: '请输入昵称', trigger: 'blur' },
				],
			},

			// 留言列表
			commentsList: [],
		}

	},

	mounted: function() {
		this.getComments()

		
	},

	watch: {
		
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
			this.replayHeard = "发表留言"
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
					this.comments.id = 0
				}
			})
		},

		getComments: function () {
			commentserver.getCommentsByArticId({ID: 0}).then((res) => {
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
				}

				this.commentsList.sort(function (a,b) {
					return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
				})
			})
		},
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
	color: rgba(0, 0, 0, 0.4);
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

</style>
