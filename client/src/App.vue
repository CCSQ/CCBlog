<template>
	<div id="app">
		<progress-bar></progress-bar>
		<el-row class="row">
			<el-col :span="5" class="header-nav">
				<header-nav></header-nav>
			</el-col>
			<el-col :span="14">
				<router-view></router-view>
			</el-col>
			<el-col :span="5">
				<tools></tools>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import ProgressBar from './components/public/Progress.vue'
	import HeaderNav from './components/public/HeaderNav.vue'
	import Tools from './components/public/Tools.vue'

	import store from './vuex/store'

	export default {
		name: 'app',
		components:{
			HeaderNav,
			ProgressBar,
			Tools,
		},
		store,
		mounted: function() {
			var url = document.location.href
			var arrStr = url.substring(url.indexOf("?") + 1).split("&")
			for(var i =0; i < arrStr.length; i++) {
				var loc = arrStr[i].indexOf("=")
				if (loc != -1) {
					var data = arrStr[i].split("=")
					if (data[1].indexOf("admin") === 0) {
						window.sessionStorage.token = data[1]
						store.commit("SET_IS_CAN_EDIT", true)
					}
				}
				
			}
		},
	}
</script>

<style scoped>

#app, .row, .header-nav {
	height: 100%;
}


</style>

