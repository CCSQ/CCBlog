<template>
	<div id="newArtic" :class="{ 'mian-hiden':hiderFlag }">
		<el-card :body-style="{ padding: '0px' }" class="well" :class="{ 'mian-hiden':hiderFlag }">
			<div class="header">
				<el-tooltip effect="dark" content="是否显示" placement="top">
				<i :class="{ 'el-icon-circle-cross':!hiderFlag, 'el-icon-plus':hiderFlag, 'edit-hiden':true }" v-show="isCanEdit" @click="hiderCar(!hiderFlag)"></i>
				</el-tooltip>
				<h3>最新发表</h3>
			</div>

			<el-menu router="router" class="menu">
				<el-menu-item class="menu-item" :class="{ 'mian-hiden':hiderFlag }" v-for='(artic,articIndex) in articList' :index="''+articIndex" :route="{ name: 'Article', params:{ ID: artic.ID } }">
					<!-- <span v-html="formatTitle(artic.title)"></span> -->
					<span>{{ artic.title }}</span>
				</el-menu-item>
			</el-menu>

		</el-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import article from '../../services/article'
import set from '../../services/set'
export default {
	name: 'newArtic',
	props: ["hider"],
	data() {
		return {
			articList: [],
			hiderFlag: this.hider,
		}
	},
	methods: {
		// formatTitle: function (value) {
		// 	var temp = ''
		// 	var times = Math.floor(value.length / 12)
		// 	for (var i = times; i >= 0; i--) {
		// 		temp += value.substring(i*12,(i+1)*12)
		// 		if (i !== 0) {
		// 			temp += '<br>'
		// 		}
		// 	}
		// 	console.log(temp)
		// 	return temp
		// },
		hiderCar: function (hider) {
			set.saveInfor({newArtic: hider}).then((res) => {
				if (res.body) {
					this.hiderFlag = hider
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

	mounted: function() {
		article.getArticleListLimit().then((res) => {
			this.articList = res.body
		})

	},

	filters: {

	},

	computed: mapGetters({
		isCanEdit: 'isCanEdit',
	}),

	watch: {
		"hider" (to, from) {
			this.hiderFlag = to
		}
	}
}
</script>

<style scoped>
#newArtic {
	margin-bottom: 15px;
}

.well {
	border-radius: 5px;
	box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
	background: #fff;
}

.header {
	border-bottom: 0px;
	padding: 10px;
}

h3 {
	box-sizing: border-box;
	width: 100%;
	height: 40px;
	line-height: 55px;
	font-size: 16px;
	font-weight: normal;
	color: rgba(0, 0, 0, 0.4);
	padding: 0 30px;
	margin: 0;
	/*border-bottom: 1px solid #eee;*/
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

span {
	width: 10px;
	word-wrap: break-word;
}

.edit-hiden {
	position: fixed;
	font-size: 10px;
	color: #ccc;
	display: none;
}

.edit-hiden:hover {
	color: #000;
	cursor: pointer;
}

.mian-hiden {
	/*background-color: rgba(255, 255, 255, 0.1);*/
	filter:alpha(opacity=70);
	opacity: 0.7;
	-moz-opacity: 0.7;
	-khtml-opacity: 0.7;
}

#newArtic:hover .mian-hiden {
	/*background-color: rgba(255, 255, 255, 1);*/
	filter:alpha(opacity=100);
	opacity: 1;
	-moz-opacity: 1;
	-khtml-opacity: 1;
}

#newArtic:hover .edit-hiden {
	display: inline-block;
}

</style>
