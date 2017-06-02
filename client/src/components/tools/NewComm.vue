<template>
	<div id="newComm" :class="{ 'mian-hiden':hiderFlag }">
		<el-card :body-style="{ padding: '0px' }" class="well" :class="{ 'mian-hiden':hiderFlag }">
			<div class="header">
				<el-tooltip effect="dark" content="是否显示" placement="top">
				<i :class="{ 'el-icon-circle-cross':!hiderFlag, 'el-icon-plus':hiderFlag, 'edit-hiden':true }" v-show="isCanEdit" @click="hiderCar(!hiderFlag)"></i>
				</el-tooltip>
				<h3>最新评论</h3>
			</div>
			<div v-for='(comm, commIndex) in commList' class="comm-content">
				<router-link  :to="{ name: 'Article', params:{ ID: comm.articId } }" class="line">
					<span>{{ comm.content }}</span>
				</router-link>
			</div>
		</el-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import commentserver from '../../services/comments'
import set from '../../services/set'
export default {
	name: 'newComm',
	props: ["hider"],
	data() {
		return {
			commList: [],
			hiderFlag: this.hider,
		}
	},
	methods: {
		hiderCar: function (hider) {
			set.saveInfor({newComm: hider}).then((res) => {
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
		commentserver.getCommleListLimit().then((res) => {
			this.commList = res.body
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
#newComm {
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

#newComm:hover .mian-hiden {
	/*background-color: rgba(255, 255, 255, 1);*/
	filter:alpha(opacity=100);
	opacity: 1;
	-moz-opacity: 1;
	-khtml-opacity: 1;
}

#newComm:hover .edit-hiden {
	display: inline-block;
}

.comm-content {
	padding: 7px 12px;
	border-top: 1px solid #ccc;
	text-indent:2em;
	font-size: 14px;
}

.comm-content .line {
	text-decoration-line: none;
	color: #000;
}

.comm-content:hover .line {
	color: #20a0ff;
}


.comm-content:nth-last-child(1) {
	margin-bottom: 12px;
	border-bottom: 1px solid #ccc;
}


</style>
