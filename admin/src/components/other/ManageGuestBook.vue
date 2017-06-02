<template>
	<div class="manageGuestBook">
		<div class="car-foot" v-if="commentsList.length !== 0">
			<div v-for="(item, commIndex) in commentsList">
				<div class="comment-item">
					<el-row :gutter="20" class="row">
						<el-col :span="1">#{{ commIndex + 1 }}</el-col>
						<el-col :span="7">{{ item.name }} | {{ item.createTime | formatTime }}</el-col>
						<el-col :span="5" :offset="11" class="resplay">
							<el-button type="primary" size="mini" @click="replayComm(item)">回复</el-button>
							<el-button type="primary" size="mini" @click="setShow(item)">{{ item.isShow == 1 ? '屏蔽' : '取消屏蔽' }}</el-button>
							<el-button type="danger" size="mini" @click="deleteComm(item, commIndex)">删除</el-button>
						</el-col>
					</el-row>
					<p class="comment-con" :class="{ 'isShow': item.isShow === 0 }">{{ item.content }}</p>

					<div class="replay comment-item-child" v-for="(childItem, childIndex) in item.child">
						<el-row :gutter="20" class="row">
							<el-col :span="2" :offset="2">#{{ commIndex + 1 }}-{{ childIndex + 1 }}</el-col>
							<el-col :span="6">{{ childItem.name }} | {{ childItem.createTime | formatTime }}</el-col>
							<!-- <el-col :span="6">{{ childItem.name }} to {{ childItem.replayName }} | {{ childItem.createTime | formatTime }}</el-col> -->
							<el-col :span="4" :offset="10" class="resplay-child">
								<el-button type="primary" size="mini" @click="replayComm(childItem)">回复</el-button>
								<el-button type="primary" size="mini" @click="setShow(childItem)">{{ childItem.isShow == 1 ? '屏蔽' : '取消屏蔽' }}</el-button>
							</el-col>
						</el-row>
						<p class="comment-con" :class="{ 'isShow': childItem.isShow === 0 }">{{ childItem.content }}</p>
					</div>
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
			<el-form :model="comments" :rules="rules" ref="content">
				<el-form-item>
					<el-button type="primary" class="button" @click="sublime(comments)">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>



</template>

<script>
import commentserver from '../../services/comments'
export default {
	name: 'manageGuestBook',
	props: ['articleInfor'],
	data () {
		return {
			ID: 0,
			replayHeard: "发表留言",
			comments: {
				articleId: 0,
				id: -1,
				content: "",
				eMail: "admin@Blog.com",
				name: "管理员",
				replayId: 0,
			},

			rules: {
				content: [
					{ required: true, message: '请输入留言内容', trigger: 'blur' },
				],
			},

			// 留言列表
			commentsList: [],
		}

	},

	mounted: function() {
		if (this.articleInfor) {
			this.ID = this.comments.articleId = this.articleInfor.ID
		}
		this.getComments()
	},

	watch: {
		articleInfor: function (to, from) {
			if (this.articleInfor) {
				this.ID = this.comments.articleId = this.articleInfor.ID
			}
			this.getComments()
		}
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
							obj.isShow = 1

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
			this.comments.replayId = item.ID
			this.replayHeard = "回复" + item.name 
		},

		cancel: function () {
			this.comments.replayId = 0
			this.replayHeard = "发表留言"
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
			commentserver.getCommentsByArticId({ID: this.ID}).then((res) => {
				res.body.sort(function (a,b) {
					return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
				})
				this.commentsList = []
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

		setShow: function (item) {
			var tempIsShow = item.isShow == 1 ? 0 : 1
			commentserver.setIsShow({id: item.ID,isShow: tempIsShow }).then((res) => {
				if (res.body.msg) {
					item.isShow = tempIsShow
					this.$message({
						message: '操作成功',
						type: 'success',
					})
				} else {
					this.$message({
						message: '操作失败',
						type: 'error',
					})
				}
			})
		},

		deleteComm: function (item, index) {
			var msg
			this.$msgbox({
				title: '删除评论?',
				message: '确定删除本条评论？删除后子评论将一并删除！',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					instance.confirmButtonLoading = false
					if (action === 'confirm') {
						instance.confirmButtonLoading = true	// 设置按钮加载
						instance.confirmButtonText = '删除中...'
						commentserver.deleteComm({id: item.ID}).then((res) => {
							if (res.data.msg) {
								msg = '删除成功'
								this.commentsList.splice(index,1)
							} else {
								msg = '删除失败'
							}
							instance.confirmButtonLoading = false
							done()
						})
					} else {
						done()
						msg = '操作已取消'
					}
				}
			}).then(action => {
				this.$message({
					type: 'info',
					message: msg
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

.car-foot {
	padding: 20px 60px;
}

.car-replay {
	/*border-top: 1px solid #d1dbe5;*/
	padding: 20px 60px;
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

.resplay-child {
	display: none;
}

.comment-item-child:hover .resplay-child {
	display: block;
}

.replay .comment-con {
	margin-left: 10%;
}

.button {
	width: 100%;
}

.isShow {
	text-decoration: line-through;
}

</style>
