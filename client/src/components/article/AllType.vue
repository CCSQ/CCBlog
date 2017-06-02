<template>
	<div class="allType">




		<el-card class="well" :body-style="{ padding: '0px' }">
			<div slot="header">
				<h3>分类</h3>
			</div>

			<div class="content">
				<el-row class="infor"><span>目前本站有 {{ typeList.length }} 个分类</span></el-row>
				<el-row :gutter="20">
					<el-col :span="5" :offset="2" v-for="(type, index) in typeList">
						<router-link :to="{ name: 'ArticleMain', params:{ pagType: type.type, pageName: type.name } }" class="link">
							{{ type.name }} ( {{ typeArticNum[type.type] ? typeArticNum[type.type] : 0 }} ) 
						</router-link>
					</el-col>
				</el-row>
			</div>
			
		</el-card>
	</div>

</template>

<script>

import articleServer from '../../services/article'

export default {
	name: 'allType',
	data () {
		return {
			typeList: [],
			typeArticNum: {},
		}
	},

	mounted: function() {
		articleServer.getArticShowType().then((res) => {
			this.typeList = res.body
		})

		articleServer.getTypeArtNum().then((res) => {
			var temp = {}
			res.body.forEach((item) => {
				temp[item.type] = item.number
			})
			this.typeArticNum = temp
		})
	},

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.well {
	margin-left: 20px;
	margin-right: 20px;
	border-radius: 5px;
	box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
	background: #fff;
}

h3 {
	box-sizing: border-box;
	width: 100%;
	height: 40px;
	line-height: 55px;
	font-size: 20px;
	font-weight: normal;
	padding: 0 30px;
	margin: 0;
	/*border-bottom: 1px solid #eee;*/
}

.well span {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
}

.content {
	padding: 20px;
	height: 590px;
}

.link {
	font-size: 10px;
	text-decoration-line: none;
}

.infor {
	padding-bottom: 20px;
}

</style>
