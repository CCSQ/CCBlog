<template>
	<div id="app">
		<!-- <progress-bar></progress-bar> -->
		<header-nav></header-nav>
		<div><router-view class="router"></router-view></div>
	</div>
</template>

<script>
	// import ProgressBar from './components/public/Progress.vue'
	import HeaderNav from './components/public/HeaderNav'

	import store from './vuex/store'

	export default {
		name: 'app',
		components:{
			HeaderNav,
			// ProgressBar,
		},
		store,
		mounted: function() {
			// console.log(store)
		},
	}
</script>

<style scoped>
.router{
	margin: 0px 80px;
	margin-top: 10px;
}
</style>

