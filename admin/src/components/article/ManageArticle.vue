<template>
	<div id="manageArticle">
		<el-row type="flex" justify="space-around">
			<el-form :inline="true" :model="manage">
				<el-form-item>
					<el-button @click="manage.time = !manage.time; changeType()" :icon="manage.time ? 'arrow-down' : 'arrow-up'">发布时间</el-button>
				</el-form-item>

				<el-form-item>
					<el-button @click="manage.browse = !manage.browse; changeType()" :icon="manage.browse ? 'arrow-down' : 'arrow-up'">浏览量</el-button>
				</el-form-item>

				<el-form-item>
					<el-button @click="manage.reply = !manage.reply; changeType()" :icon="manage.reply ? 'arrow-down' : 'arrow-up'">回复量</el-button>
				</el-form-item>

				<el-form-item>
					<el-button @click="manage.lastReply = !manage.lastReply; changeType()" :icon="manage.lastReply ? 'arrow-down' : 'arrow-up'">最后回复</el-button>
				</el-form-item>

				<el-form-item label="分类">
					<el-select v-model="manage.type" placeholder="请选择分类" @change="changeType()">
						<el-option v-for="typeItem in articleType" :label="typeItem.name" :value="typeItem.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-row>

		<el-row v-loading.body="loading">
			<el-col :span="22" :offset="1" v-for="(artic, index) in articleInfor">
				<el-card :body-style="{ padding: '0px' }" class="articItem">
						<div slot="header" class="clearfix">
							<span style="line-height: 10px;" class="articTitle" @click="updateArtic(index)">{{ artic.title }}</span>
							<el-tag type="primary" v-for="tag in formatTags(artic.tags)" >{{ tag }}</el-tag>
							<el-switch :width="70" v-model="artic.isShow" @change="changeIsShow(artic)" on-text="发布" off-text="未发布"></el-switch>
							<el-button style="float: right;" type="primary" icon="delete" @click="deleteArtic(artic,index)"></el-button>
						</div>
						<div style="padding: 14px;">
							<span>{{ artic.infor }}</span>
							<div class="bottom clearfix">
								<time class="time">{{ artic.createTime | formatTime }}</time>
								<span class="borrep">浏览:{{ artic.browseNumber }} | <span class="commMenage" @click="menageComm(index)">回复: {{ artic.relyNumber }}</span></span>
							</div>
						</div>
				</el-card>
				<br>
			</el-col>
		</el-row>

		<el-dialog :modal-append-to-body="false" v-model="dialogVisible" size="full">
			<add-article :articleInfor="articleInfor[selectEd]"></add-article>
		</el-dialog>

		<el-dialog :modal-append-to-body="false" v-model="dialogCommMenagVisible" size="full">
			<manage-guest-book :articleInfor="articleInfor[selectEd]"></manage-guest-book >
		</el-dialog>
	</div>
</template>

<script>
import AddArticle from './AddArticle'
import ManageGuestBook from '../other/ManageGuestBook'
import article from '../../services/article'
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'manageArticle',
	props: ['typeInfor'],
	data() {
		return {
			dialogVisible: false,
			dialogCommMenagVisible: false,
			loading: false,
			start: 0,
			length: 12,
			isHave: true,	// 是否还有博文
			manage: {
				type: '',	// 文章分类
				// 排序 默认从小到大
				time: true,
				browse: false,
				reply: false,
				lastReply: false,
			},
			selectEd: 0,	// 修改的文章
			articleInfor: [],
		}
	},
	methods: {
		...mapActions({
			getArtType: 'setArticleType',
		}),

		formatTags: function(value) {
			if (value === "") {
				return []
			}
			return value.split(",")
		},

		changeType: function () {
			this.start = 0
			this.isHave = true
			this.articleInfor = []
			this.getArtInfor()
		},

		// 修改博文
		updateArtic: function (index) {
			this.dialogVisible = true
			this.selectEd = index
		},

		// 设置从父窗口传过来的值
		setInfor: function(){
			if (this.typeInfor) {
				this.manage.type = this.typeInfor.value
			}
		},

		// 修改博文可见
		changeIsShow: function (artic) {
			article.updateArticleIsShow({id: artic.ID,isShow: artic.isShow}).then((res) => {
				if (res.data) {
					var msg
					if (artic.isShow) msg = "发布成功"
					else msg = "已取消发布"
					this.$message({
						message: msg,
					})
				} else {
					artic.isShow = !artic.isShow
					this.$message({
						message: "操作失败",
						type: 'error',
					})
				}
			})
		},

		// 删除博文
		deleteArtic: function (artic, index) {
			var msg
			this.$msgbox({
				title: '删除博文?',
				message: '确定删除 ' + artic.title + "？",
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					instance.confirmButtonLoading = false
					if (action === 'confirm') {
						instance.confirmButtonLoading = true	// 设置按钮加载
						instance.confirmButtonText = '删除中...'
						article.deleteArticle({id: artic.ID}).then((res) => {
							if (res.data) {
								msg = '删除成功'
								this.articleInfor.splice(index,1)
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
		
		// 获取博文简介
		getArtInfor: function() {
			if (!this.isHave) return
			if (this.loading) return
			this.loading = true
			article.getArticleInfor({
				start: this.start,
				length: this.length,
				param: this.manage,
			}).then((res) => {
				if (typeof res.body === "string") {
					this.$message({
						message: res.body,
						type: 'error',
					})
				} else {
					for (var i = res.body.length - 1; i >= 0; i--) {
						res.body[i].isShow = res.body[i].isShow === 0 ? false : true
						res.body[i].private = res.body[i].private === 0 ? false : true
					}
					this.articleInfor = this.articleInfor.concat(res.body)
					if (res.body.length < this.length) this.isHave = false
				}
				this.loading = false
			})
		},

		// 评论管理
		menageComm: function (index) {
			this.dialogCommMenagVisible = true
			this.selectEd = index
		}
	},

	mounted: function() {
		this.getArtType()
		this.setInfor()
		var that = this
		that.getArtInfor()
		window.onscroll = function () {
			var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
			if ($(document).height() - (scrollHeight + $(window).height()) < 100) {
				that.start += that.length
				that.getArtInfor()
			}
		}
	},

	watch: {
		typeInfor: function (newVal, oldVal) {
			this.setInfor()
		},
		dialogCommMenagVisible: function (to, from) {
			if (!to) {
				this.selectEd = -1
			}
		},

		dialogVisible: function (to, from) {
			if (!to) {
				this.selectEd = -1
			}
		},
	},

	computed: mapGetters({
		articleType: 'getArticleType',
	}),

	filters: {
		formatTime: function(value) {
			return value.substr(0,10)
		},
	},

	components:{
		AddArticle,
		ManageGuestBook,
	},
}
</script>

<style scoped>

.time {
	font-size: 13px;
	color: #999;
}

.borrep {
	font-size: 13px;
	color: #999;
	float: right;
	padding: 0;
}


.articItem:after {
	content: "";
	position: absolute;
	/*bottom: 1px;*/

	height: 2px;
	width: 0;
	background: #20a0ff;
	transition: all 0.4s ease-in;
	
}

.articItem:hover:after {
	width: 91.5%;
}

.articItem:hover .articTitle{
	color: #20a0ff;
}

.articTitle:hover {
	cursor: pointer;
}

.commMenage:hover {
	cursor: pointer;
	color: #20a0ff;
}

</style>
