<template>
	<div id="manageArtiType">
		<el-row>
			<el-col :span="20" :offset="2">
				<el-card :body-style="{ padding: '0px' }" class="card-main">
					<div class="title">
						<span>目前本站有 {{ articleType.length }} 个分类</span>
						<i class="el-icon-plus add-type" @click="addType()"></i>
						<br>
					</div>
					<el-row :gutter="20">
						<el-col :span="5" :offset="1" v-for="(type, index) in articleType">
							<el-button type="text" class="button" @click="selectMAnage(index)">{{ type.name }} ( {{ typeArticNum[type.value] ? typeArticNum[type.value] : 0 }} ) </el-button>
							<i class="el-icon-delete delete-type" @click="deleteType(type)" v-if="type.value != 'none'"></i>
							<el-tooltip class="item" effect="dark" content="是否显示" placement="top">
								<i :class="{ 'el-icon-star-on':type.isShow, 'el-icon-star-off':!type.isShow, 'delete-type':true }" @click="changTypeIsShow(type)" v-if="type.value != 'none'"></i>
							</el-tooltip>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>

		<el-dialog title="新增分类" v-model="dialogAddTypeVisible" size="mini">
			<el-form  :inline="true" :model="newType" :rules="rules" ref="addType" label-width="70px">
				<el-form-item label="分类名" prop="name">
					<el-input v-model="newType.name"></el-input>
				</el-form-item>
				<el-form-item label="显示">
					<el-switch on-text="" off-text="" v-model="newType.isShow"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAddTypeVisible = false; newType={name: '',value: '',}">取 消</el-button>
				<el-button type="primary" @click="addTypeToServer(newType)">新 增</el-button>
			</div>
		</el-dialog>

		<el-dialog :modal-append-to-body="false" :modal="false" v-model="dialogVisible" size="full">
			<manage-article :typeInfor="typeInfor"></manage-article>
		</el-dialog>
	</div>
</template>

<script>
import ManageArticle from './ManageArticle'
import article from '../../services/article'
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'manageArtiType',
	data() {
		return {
			typeInfor: "",
			dialogVisible: false,
			dialogAddTypeVisible: false,
			typeArticNum: {},
			newType: {
				name: "",
				value: "",
				isShow: false,
			},
			rules: {
				name: [
					{ required: true, message: '请输入分类名', trigger: 'blur' },
				],
			},
		}
	},
	methods: {
		...mapActions({
			addArtType: 'addArticleType',
			getArtType: 'setArticleType',
			delArtType: 'delArticleType',
			setArtType: 'setArticleTypeIsShow',
		}),

		selectMAnage: function(index) {
			this.typeInfor = this.articleType[index]
			this.dialogVisible = true
		},

		addType: function () {
			this.dialogAddTypeVisible = true
		},

		deleteType: function (type) {
			var msg
			this.$msgbox({
				title: '删除分类?',
				message: '确定删除分类 ' + type.name + "？",
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					instance.confirmButtonLoading = false
					if (action === 'confirm') {
						instance.confirmButtonLoading = true	// 设置按钮加载
						instance.confirmButtonText = '删除中...'
						article.deleteArtType({value: type.value}).then((res) => {
							if (res.data) {
								msg = '删除成功'
								this.delArtType(type.value)
								this.getArtTypeArtNum()
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

		changTypeIsShow: function (type) {
			article.changTypeIsShow({value:type.value, isShow: type.isShow ? 0 : 1}).then((res) => {
				if (res.body) {
					this.setArtType(type)
					this.$message({
						message: type.isShow ? "分类已屏蔽" : "分类已开放",
						type: 'success',
					})
				} else {
					this.$message({
						message: "操作失败",
						type: 'error',
					})
				}
			})
			
		},

		addTypeToServer: function (type) {
			this.$refs['addType'].validate((valid) => {
				if (valid) {
					for (var i = this.articleType.length - 1; i >= 0; i--) {
						if (this.articleType[i].name === type.name) {
							this.$message({
								message: "分类已存在",
								type: 'warning',
							})
							return
						}
					}
					article.addArticType(type).then((res) => {
						if (res.data) {
							type.value = res.data.value
							this.addArtType(type)
							this.$message({
								message: "新增成功",
								type: 'success',
							})
							this.dialogAddTypeVisible = false
						} else {
							this.$message({
								message: "新增失败，请稍后再试",
								type: 'error',
							})
						}
					})
				} else {
					this.$message({
						message: "分类名不能为空",
						type: 'warning',
					})
				}
			})
		},

		// 获取分类博文数量
		getArtTypeArtNum: function () {
			article.getTypeArtNum().then((res) => {
				var temp = {}
				res.body.forEach((item) => {
					temp[item.type] = item.number
				})
				this.typeArticNum = temp
			})
		},
	},

	mounted: function() {
		this.getArtType()
		this.getArtTypeArtNum()
	},

	computed: mapGetters({
		articleType: 'getArticleType',
	}),

	components:{
		ManageArticle,
	},
}
</script>

<style scoped>
.title {
	padding: 20px;
	color: #999;
}

.title:after {
	content: "";
	position: absolute;
	/*bottom: 1px;*/

	height: 1px;
	width: 0;
	background: #20a0ff;
	transition: all 0.4s ease-in;
	
}

#manageArtiType:hover .title:after {
	width: 75%;
}

.card-main{
	height: 500px;
}

.add-type {
	float: right;
	margin-right: 2%;
}

.add-type:hover {
	cursor: pointer;
}

.delete-type {
	float: right;
	margin-top: 4%;
	margin-right: 10%;
	color: #999;
}

.delete-type:hover {
	cursor: pointer;
	color: #20a0ff;
}

</style>
