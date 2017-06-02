<template>
	<div class="index">
		<iframe id="index" :src="clientAddr + '?data=' + param" width="100%" scrolling="yes"></iframe>
	</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'index',
	data () {
		return {
			clientAddr: process.env.clientApi,
			param: 'admin',
		}
	},
	methods: {
		...mapActions({
			getLog: 'setIsLogin',
		}),

		
	},

	mounted: function() {
		$("#index").height($(window).height() - 100)
		window.onresize = function(){
			$("#index").height($(window).height() - 100)
		}
	// 	this.getLog()
	},

	computed: mapGetters({
		isLogin: 'getIsLogin',
	}),
}
</script>

<style scoped>

#index{
	border: 0px;
}

</style>
