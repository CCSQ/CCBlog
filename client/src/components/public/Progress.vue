<!-- 进度条 -->
<template>
	<div v-show="progressStatus">
		<el-progress :percentage="percent" :stroke-width="2" :show-text="false" class="progress"></el-progress>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data () {
		return {
			percent: 0, // 进度
			progressStatus: false, // 是否显示进度条
		}
	},

	methods: {
		start () {
			this.progressStatus = true
			this.percent = 0
			this.startTimer = window.setInterval(() => {	// 不停调用
				if (this.percent < 100) {
					this.percent = this.percent + Math.random() * 20
				}
			}, 100)
		},

		finish () {
			this.percent = 100
			clearInterval(this.startTimer)	// 清除调用
			this.hide()
		},

		// 进度条隐藏
		hide () {
			setTimeout(() => {
				this.progressStatus = false
			}, 300)
		}
	},

	// mounted: function() {
	// 	this.start()
	// },

	watch: {
		showLoading (newVal, oldVal) {
			if (newVal) {
				this.start()
			} else {
				this.finish()
			}
		}
	},

	computed: mapGetters({
		showLoading: 'getShowLoading',
	}),

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.progress {
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	height: 1px;
	width: 100%;
	transition: width 0.2s, opacity 0.6s;
	opacity: 1;
	background-color: #42b983;
	z-index: 999999;
}
</style>
