<template>
	<div class="allTags">

		<el-card class="well" :body-style="{ padding: '0px' }">
			<div slot="header">
				<h3>标签</h3>
			</div>

			<div class="content">
				<el-row class="infor"><span>目前本站有 {{ tagList.length }} 个标签</span></el-row>
				<el-row :gutter="20">
					<el-col :span="5" :offset="2" v-for="(tag, index) in tagList">
						<router-link :to="{ name: 'ArticleList', params:{ searchTag: tag, searchTitleKey: '0' } }" class="link">
							<el-tag :type="'primary'">{{ tag }}</el-tag>
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
	name: 'allTags',
	data () {
		return {
			tagList: [],
		}
	},

	mounted: function() {
		articleServer.getAllTags().then((res) => {
			// this.tagList = res.body
			var temp = {}
			res.body.forEach((item) => {
				var tempList = item.tags.split(",")
				tempList.forEach((tag) => {
					if (temp[tag]) {
						temp[tag] ++
					} else {
						temp[tag] = 1
					}
				})
			})

			for(var obj in temp) {
				this.tagList.push(obj)
			}
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
