<template>
	<div id="side-left">
		 <el-card :body-style="{ padding: '0px' }" class="infor-car">
			<i :class="{ 'el-icon-check':edit, 'el-icon-setting':!edit, 'edit-logo':true }" v-show="isCanEdit" @click="entEdit"></i>
			<img id="logo" :src="initParam.logoUrl" alt="" :class="{'can-hover':edit}" @click="changLogo">
			<div class="infor-div">
				<h4 class="title" :contenteditable="edit" v-on:keyup="changTitle($event)">{{ initParam.title }}</h4>
				<p class="in-span" :contenteditable="edit" v-on:keyup="changInfor($event)">{{ initParam.infor }}</p>
				<el-row :gutter="45" class="three-type">
					<el-col :span="4" :offset="6">
						<router-link :to="{ name: 'ArticleMain', params:{ pagType: 'all', pageName: 'all' } }" >
							<el-tooltip class="item" effect="dark" content="文章" placement="bottom">
								<p>{{articNumInfor.num}}<i class="el-icon-edit"></i></p>
							</el-tooltip>
						</router-link>

					</el-col>
					<el-col :span="4">
						<router-link :to="{ name: 'AllType' }" >
							<el-tooltip class="item" effect="dark" content="分类" placement="bottom">
								<p>{{articNumInfor.type.length}}<i class="el-icon-menu"></i></p>
							</el-tooltip>
						</router-link>
					</el-col>
					<el-col :span="4">
						<router-link :to="{ name: 'AllTags' }" >
							<el-tooltip class="item" effect="dark" content="标签" placement="bottom">
								<p>{{articNumInfor.tips.length}}<i class="el-icon-more"></i></p>
							</el-tooltip>
						</router-link>
					</el-col>
				</el-row>
			</div>

			<el-menu default-active="0" router="router" class="menu">
				<el-menu-item index="#" class="menu-item" @click="editMenu" v-show="edit"><i class="el-icon-plus"></i></el-menu-item>
				<el-menu-item class="menu-item select-item" v-for = '(nav,navIndex) in navList' :index="navIndex+''" :route="{name: nav.linkName, params:{ pagType: nav.pagType, pageName: nav.pageName }}">{{ nav.pageName }}</el-menu-item>
			</el-menu>
		</el-card>


		<el-dialog title="修改Logo" :modal-append-to-body="false" size="large" v-model="dialogImgVisible">
			<logo-manage @setThisImg="getLogoUrl"></logo-manage>
		</el-dialog>

		<el-dialog title="导航栏修改" :modal-append-to-body="false" v-model="dialogMenuVisible">
			<menu-manage :nav="navList"></menu-manage>
		</el-dialog>

		<!-- <div class="header-infor panel radius small-text-center">
			<img id="logo" src="../../assets/img/logo.png" alt="">
			<h4 class="head-title"><a href="/">CCBlog</a></h4>
			<span class="head-subtitle">WEBer</span>
		</div> -->


		<!-- <ul class="side-menu-list">
			<li class="side-menu-item" v-for = 'nav in navList'>
				<router-link :to="{ name: nav.linkName, params:{ pagType: nav.pagType, pageName: nav.pageName } }" >{{ nav.pageName }}</router-link>
			</li>
		</ul> -->
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LogoManage from '../pictures/LogoManage'
import MenuManage from '../set/MenuManage'
import article from '../../services/article'
import set from '../../services/set'

export default {
	data () {
		return {
			articNumInfor: {
				num: 0,
				type: [],
				tips:[],
			},
			edit: false,
			dialogImgVisible: false,
			dialogMenuVisible: false,
		}
	},
	methods: {
		...mapActions({
			getNavByServer: 'setNavList',
			getIscaEd: 'setIsCanEdit',
			getInitParamByServer: 'setInitParam',
			setInitParamByName: 'setInitParamByName',
		}),

		// 进入编辑模式
		entEdit: function () {
			if (!this.edit) {
				this.edit = !this.edit
				this.$message('进入编辑模式')
			} else {
				// this.edit = !this.edit
				// this.$message('保存')
				set.saveInfor({
					logoUrl	: this.initParam.logoUrl ,
					title	: this.initParam.title ,
					infor	: this.initParam.infor ,
				}).then((res) => {
					if (res.body) {
						this.edit = false
						this.$message('保存成功')
					} else{
						this.$message({
							message: '保存失败',
							type: 'error',
						})
					}
				})
			}
		},

		// 修改信息
		changTitle: function (event) {
			// this.title = event.srcElement.innerHTML
			this.setInitParamByName({name:"title", param:event.srcElement.innerHTML})
		},

		changInfor: function (event) {
			// this.infor = event.srcElement.innerHTML
			this.setInitParamByName({name:"infor", param:event.srcElement.innerHTML})
		},

		// 三标签跳转
		// changTheWin: function () {
		// 	console.log('demo')
		// },

		// 修改logo
		changLogo: function () {
			if (!this.edit) return
			this.dialogImgVisible = true
		},

		// 修改导航列表
		editMenu: function () {
			this.dialogMenuVisible = true
		},

		// 设置logo
		getLogoUrl: function (logoUrl) {
			this.setInitParamByName({name:"logoUrl", param:logoUrl})
			this.dialogImgVisible = false
		},

		// 获取文章信息
		getArticNumInfor: function () {
			article.getArticNumInfor().then((res) => {
				this.articNumInfor.type = res.body.pop()
				this.articNumInfor.num = res.body.length
				for (var i = res.body.length - 1; i >= 0; i--) {
					if(res.body[i] === ""){
						continue
					}
					var tips = res.body[i].tags.split(',')
					var hash = {}
					for (var j = tips.length - 1; j >= 0; j--) {
						if(tips[j] === ""){
							continue
						}
						if (!hash[tips[j]]) {
							this.articNumInfor.tips.push(tips[j])
						}
					}
				}
			})
		}
	},


	mounted: function() {
		this.getNavByServer()
		this.getInitParamByServer()
		this.getIscaEd()
		this.getArticNumInfor()
		// setTimeout(function() {
		// 	$('.menu-item')[1].click()
		// }, 100000);
		// this.startTimer = window.setInterval(() => {	// 不停调用
		// 	if ($('.select-item')[0]) {
		// 		$('.select-item')[0].click()
		// 		clearInterval(this.startTimer)
		// 	}
		// }, 100)
	},

	components:{
		LogoManage,
		MenuManage,
	},


	computed: mapGetters({
		navList: 'getNavList',
		isCanEdit: 'isCanEdit',
		initParam: 'getInitParam',
	}),

	watch: {
		navList: function (newVal, oldVal) {
			if (this.dialogMenuVisible) {
				this.$message({
					message: '成功设置导航栏',
					type: 'success',
				})
				this.dialogMenuVisible = false
			}
		}
	},
}
</script>

<style scoped>

	#side-left {
		/*border: 1px solid red;*/
		border-radius: 5px;
		box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
		height: 100%;
	}

	#side-left:hover .edit-logo {
		display: inline-block;
	}

	#logo {
		display: block;
		width: 100px;
		height: 100px;
		margin: 0 auto 28px;
		border-radius: 100%;
		margin-top: 30px;
	}

	.infor-car {
		/*background-color: #eef1f6;*/
		border-width: 0px;
		margin: 0px;
		height: 100%;
	}

	.title {
		text-align: center;
		font-size: 20px;
		font-weight: normal;
		color: #555;
		margin-bottom: 8px;
	}

	.title:after {
		/*content: '111';*/
		/*position: absolute;*/
		/*top: 190px;*/
		/*left: 15%;*/
		/*height: 1px;*/
		/*width: 70%;*/
		/*background: rgba(0, 0, 0, 0.4);*/
		/*transition: all 0.2s ease-in;*/
		/*transform: scaleX(1);*/
	}

	#side-left:hover .title:after {
		transform: scaleX(0);
	}

	.in-span {
		font-size: 14px;
		text-align: center;
		color: #777;
	}

	.three-type {
		font-size: 10px;
		color: #555;
	}

	.three-type p {
		margin-top: 0px;
		transition: font-size 0.2s;
	}

	.three-type p:hover {
		cursor: pointer;
		color: #20a0ff;
		font-size: 14px;
	}

	.menu-item {
		border-top: 1px solid #ccc;
		text-align: center;
		background-color: #fff;
	}

	.menu-item:hover {
		background-color: #20a0ff;
		color: #fff;
	}

	.menu-item:nth-last-child(1) {
		border-bottom: 1px solid #ccc;
	}

	.edit-logo {
		display: none;
		position: fixed;
		left: 6%;
		font-size: 10px;
	}

	.edit-logo:hover {
		cursor: pointer;
	}

	.can-hover {
		cursor: pointer;
	}

	.el-icon-check {
		display: inline-block;
	}

	a {
		text-decoration: none;
		color: #555;
	}

</style>
