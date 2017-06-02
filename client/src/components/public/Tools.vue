<template>
	<div id="tools">
		<new-artic :hider="newArtic" v-show="isCanEdit || !newArtic"></new-artic>
		<new-Comm :hider="newComm" v-show="isCanEdit || !newComm"></new-Comm>
		<!-- <music></music> -->
	</div>
</template>

<script>
import Music from '../tools/Music'
import NewArtic from '../tools/NewArtic'
import NewComm from '../tools/NewComm'
import set from '../../services/set'
import { mapGetters } from 'vuex'
export default {
	name: 'tools',
	data() {
		return {
			newArtic: true,
			newComm: true,
		}
	},
	methods: {
		
	},

	mounted: function() {
		set.getParam({list:['newArtic','newComm']}).then((res) => {
			res.body.forEach((item) => {
				if (item.name === "newArtic") {
					this.newArtic = item.param === "true"
				}
				if (item.name === "newComm") {
					this.newComm = item.param === "true"
				}
			})
		})
	},

	components:{
		Music,
		NewArtic,
		NewComm,
	},

	computed: mapGetters({
		isCanEdit: 'isCanEdit',
	}),
}
</script>

<style scoped>



</style>
