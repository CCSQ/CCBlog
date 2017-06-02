<template>
	<div>
		<el-row>
			<el-col :span="22" :offset="1">
				<el-menu mode="horizontal" router="router" v-if="isLogin">
					<el-menu-item index="1" :route="{name: 'index'}">首 页</el-menu-item>
					<el-submenu index="2">
						<template slot="title">文章</template>
						<el-menu-item index="2-1" :route="{name: 'addArticle'}">发 布</el-menu-item>
						<el-menu-item index="2-2" :route="{name: 'manageArticle'}">管 理</el-menu-item>
						<el-menu-item index="2-3" :route="{name: 'manageArtiType'}">分 类</el-menu-item>
					</el-submenu>
					<el-menu-item index="3" :route="{name: 'managePictures'}">相 册</el-menu-item>
					<!-- <el-menu-item index="5" :route="{name: 'manageComments'}">评 论</el-menu-item> -->
					<el-menu-item index="4" :route="{name: 'manageGuestBook'}">留 言</el-menu-item>
				</el-menu>
			</el-col>
		</el-row>
		<!-- <nav class="top-bar" data-topbar>
			<ul class="title-area">
				<li class="name"><h1><a href="#/"><i class="fi-home"></i> CCBlog</a></h1></li>
				<li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
			</ul>

			<section class="top-bar-section">
				<ul class="left" v-if="isLogin">
					<li><router-link :to="{ name: 'article' }" ><i class="fi-pencil"></i> 文 章</router-link></li>
					<li><a href="#"><i class="fi-comments"></i> 消 息</a></li>
					<li><a href="#"><i class="fi-widget"></i> 设 置</a></li>
				</ul>
			</section>
		</nav> -->
	</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
	data () {
		return {
		}
	},
	methods: {
		...mapActions({
			getLog: 'setIsLogin',
		}),
	},

	mounted: function() {
		this.getLog()
		// if (!this.isLogin) {
		// 	window.location.hash = '#/login'
		// }
	},

	computed: mapGetters({
		isLogin: 'getIsLogin',
	}),
}
</script>

<style scoped>


</style>
