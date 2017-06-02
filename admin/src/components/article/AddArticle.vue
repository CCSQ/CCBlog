<template>
	<div>
		<el-tabs v-model="editableTabsValue" type="card" :editable="editable" @edit="handleTabsEdit" @tab-click="changTab">
			<el-tab-pane label="相册" :closable="1 == 0">
				<manage-pictures></manage-pictures>
			</el-tab-pane>
			<el-tab-pane v-for="(item, index) in editableTabs" :label="item.title | subString" :name="item.name">
				<el-form :model="item" :rules="rules" :ref="item.name" label-width="100px">

					<el-form-item label="标题" prop="title">
						<el-input v-model="item.title"></el-input>
					</el-form-item>

					<el-form-item label="正文" prop="content">
						<mavon-editor :value="item.edicValue" :scrollStyle='true' :toolbars="toolbars" @change="getInfor"></mavon-editor>
					</el-form-item>

					<el-form-item label="发布">
						<el-switch on-text="" off-text="" v-model="item.isShow"></el-switch>
					</el-form-item>

					<el-form-item label="加密">
						<el-switch on-text="" off-text="" v-model="item.private"></el-switch>
					</el-form-item>

					<el-form-item label="密码" prop="pwd" v-if="item.private">
						<el-input type="password" v-model="item.pwd"></el-input>
					</el-form-item>

					<el-form-item label="文章分类" prop="type">
						<el-select v-model="item.type" placeholder="请选择分类">
							<el-option v-for="(typeItem, typeIndex) in articleType" :label="typeItem.name" :value="typeItem.value"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="标签">
						<el-tag :type="'primary'" v-for="(tag, tagIndex) in item.tags" :closable="true" :close-transition="false" @close="handleClose(item.tags,tagIndex)">{{tag}}</el-tag>
						<el-col :span="2" v-if="item.inputVisible">
							<el-input class="input-new-tag" v-model="item.inputValue":ref="item.name+'tag'" size="mini" @keyup.enter.native="handleInputConfirm(item)" @blur="handleInputConfirm(item)">
							</el-input>
						</el-col>
						<el-button v-else class="button-new-tag" size="small" @click="showInput(item)">+ 标签</el-button>

					</el-form-item>

					 <el-form-item>
						<el-button type="primary" @click="submitForm(item)">提交</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import article from '../../services/article'
import ManagePictures from '../pictures/ManagePictures'
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'addArticle',
	props: ['articleInfor'],
	data() {
		return {
			editable: true,
			editableTabsValue: '1',	// 默认选中
			selectIndex: 1,	// 选中的下标
			tabLeng: 1,	// tab被创建出来的个数
			editableTabs: [
				{
					title: '新建博文',	// 博文标题
					name: '1',	// 不同tab的标识
					private: false,	// 加密
					pwd: "",	// 加密密码
					tags: [],	// 标签
					inputVisible: false,	// 能否输入标签
					inputValue: '',		// 标签文本
					type: '',	// 文章分类
					content: '',	// 文章正文
					edicValue: '',	// 编辑器格式的文章正文
					infor: '',	// 博文简介
					isShow: false,	// 是否发布
				},
			],

			// 表单验证规则
			rules: {
				title: [
					{ required: true, message: '请输入博文标题', trigger: 'blur' },
				],
				pwd: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
				],
				type: [
					{ required: true, message: '请选择文章分类', trigger: 'change' },
				],
				content: [
					{ required: true, message: '文章正文不能为空', trigger: 'blur' },
				],
			},

			// 工具栏
			toolbars: {
				bold: true, // 粗体
				italic: true,// 斜体
				header: true,// 标题
				underline: true,// 下划线
				strikethrough: true,// 中划线
				mark: true,// 标记
				superscript: true,// 上角标
				subscript: true,// 下角标
				quote: true,// 引用
				ol: true,// 有序列表
				ul: true,// 无序列表
				link: true,// 链接
				imagelink: true,// 图片链接
				code: true,// code
				table: true,// 表格
				subfield: true,// 是否需要分栏
				fullscreen: true,// 全屏编辑
				readmodel: true,// 沉浸式阅读
				htmlcode: true,// 展示html源码
				help: true// 帮助
			},

		}
	},
	methods: {
		...mapActions({
			getArtType: 'setArticleType',
		}),
		handleTabsEdit(targetName, action) {
			if (action === 'add') {
				let newTabName = ++this.tabLeng + ''
				this.editableTabs.push({
					title: '新建博文',
					name: newTabName,
					private: false,
					tags: [],
					inputVisible: false,
					inputValue: '',
					type: '',
					content: '',
					infor: '',
					isShow: false,
					edicValue: "",
				},)
				this.editableTabsValue = newTabName
			}
			if (action === 'remove') {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1]
							if (nextTab) {
								activeName = nextTab.name
							}
						}
					})
				}
				
				this.editableTabsValue = activeName
				this.editableTabs = tabs.filter(tab => tab.name !== targetName)
			}
		},

		// 切换标签
		changTab: function (tab) {
			this.selectIndex = tab.index
		},

		// 移除标签
		handleClose: function(tags,index) {
			tags.splice(index,1)
			console.log(this)
		},

		// 添加标签
		handleInputConfirm: function (item) {
			var flag = true
			item.tags.forEach((tag, index) => {
				if (tag === item.inputValue) {
					flag = false
				}
			})
			if (item.inputValue && flag) {
				item.tags.push(item.inputValue)
			}
			item.inputVisible = false
			item.inputValue = ""
		},

		// 显示添加标签
		showInput: function(item) {
			item.inputVisible = true
			this.$nextTick(_ => {
				this.$refs[item.name+'tag'][0].$refs.input.focus()
			})
		},

		// 截取部分博文
		getInfor: function (value, reder) {
			this.editableTabs[this.selectIndex - 1].infor = value.substr(0,80)
			this.editableTabs[this.selectIndex - 1].content = reder
			this.editableTabs[this.selectIndex - 1].edicValue = value
		},

		// 设置父窗口传过来的值
		setInfor: function () {
			if (this.articleInfor) {
				this.editable = false
				this.editableTabs[0].id = this.articleInfor.ID
				this.editableTabs[0].title = this.articleInfor.title
				this.editableTabs[0].private = this.articleInfor.private
				this.editableTabs[0].tags = this.articleInfor.tags.split(",")
				this.editableTabs[0].type = this.articleInfor.type
				this.editableTabs[0].infor = this.articleInfor.infor
				this.editableTabs[0].isShow = this.articleInfor.isShow
				this.editableTabs[0].content = this.articleInfor.content
				this.editableTabs[0].edicValue = this.articleInfor.edicValue
			}
		},

		// 提交博文
		submitForm: function(item) {
			this.$refs[item.name][0].validate((valid) => {
				if (valid) {
					if (item.id) {
						article.updateArticle(item).then((res) => {
							if (res.body) {
								this.$message({
									message: '保存成功',
									type: 'success',
								})
								// setTimeout(function() {window.location.reload()}, 1000)
							} else {
								this.$message({
									message: '保存失败',
									type: 'error',
								})
							}
						})
					} else {
						article.addArticle(item).then((res) => {
							console.log(res.body)
							if (res.body.id) {
								this.$message({
									message: '保存成功',
									type: 'success',
								})
								item.id = res.body.id
							} else {
								this.$message({
									message: res.body.id,
									type: 'error',
								})
							}
						})
					}
				} else {
					this.$message({
						message: "请填写完整",
						type: 'warning',
					})
				}
			})
		},
	},

	mounted: function() {
		this.getArtType()
		this.setInfor()
	},

	watch: {
		articleInfor: function (newVal, oldVal) {
			this.setInfor()
		}
	},

	computed: mapGetters({
		articleType: 'getArticleType',
	}),

	filters: {
		subString: function(value) {
			if (value.length < 6) {
				return value
			} else {
				return value.substr(0,6) + '...'
			}
		}
	},
	components:{
		ManagePictures,
	},
}
</script>

<style scoped>

</style>
