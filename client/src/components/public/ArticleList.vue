<template>
	<div class="articleList">


		<el-card class="box-card well" :body-style="{ padding: '0px' }">
			<div slot="header">
				<h3>{{ $route.params.searchTag || $route.params.searchTitleKey }}</h3>
			</div>

			<div v-if="title.length > 0" class="main">
				<el-row>
					<el-col :span="22" :offset="1" v-for="(artic, index) in title">
						<el-card :body-style="{ padding: '0px' }" class="articItem">
								<router-link :to="{ name: 'Article', params:{ ID: artic.ID } }" class="header">
									<span style="line-height: 10px;" class="itemTitle">{{ artic.title }}</span>
									<el-tag type="primary" v-for="tag in formatTags(artic.tags)" >{{ tag }}</el-tag>
								</router-link>
								<div style="padding: 0px 14px;">
									<span class="articInfor">{{ artic.infor }}</span>
									<div class="bottom">
										<time class="time">{{ artic.createTime | formatTime }}</time>
										<span class="borrep">浏览:{{ artic.browseNumber }} | 回复: {{ artic.relyNumber }}</span>
									</div>
								</div>
						</el-card>
					</el-col>
				</el-row>
			</div>
			<div v-else>无文章</div>
		</el-card>
	</div>
</template>

<script>
import article from '../../services/article'

export default {
	name: 'articleList',
	data () {
		return {
			title:[], // 信息
		}
	},

	methods: {
		formatTags: function(value) {
			if (value === "") {
				return []
			}
			return value.split(",")
		},

		// getThisArtic: function (param) {
		// 	var arrTemp = param.split('-')
		// 	for (var i = 0; i < this.title.length; i++) {
		// 		if (this.title[i].sort === (arrTemp[0] + ''+ arrTemp[1])){
		// 			if (this.title[i].articList.length === 0) {
		// 				article.getArticListByTime({year:arrTemp[0], month:arrTemp[1], type: this.listType}).then((res) => {
		// 					for (var j = 0; j < res.body.length; j++) {
		// 						res.body[j].createDay = new Date(res.body[j].createTime).getDate()

		// 						var date = new Date(res.body[j].lastRely)
		// 						res.body[j].lastRely = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
		// 					}

		// 					res.body.sort(function (a,b) {
		// 						return b.createDay - a.createDay
		// 					})
		// 					this.title[i].articList = res.body
		// 					// console.log(res.body)
		// 				})
		// 			}
		// 			break
		// 		}
		// 	}
		// }
	},

	mounted: function() {
		var param = {
			tag: this.$route.params.searchTag,
			titleKey: this.$route.params.searchTitleKey,
		}

		article.searchArtic(param).then((res) => {
			this.title = res.body
			console.log(res.body)
		})
	},

	watch: {
		'$route' (to, from) {
			var param = {
				tag: to.params.searchTag,
				titleKey: to.params.searchTitleKey,
			}

			article.searchArtic(param).then((res) => {
				this.title = res.body
			})
		},
	},

	filters: {
		formatTime: function(value) {
			return value.substr(0,10)
		},
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
	color: rgba(0, 0, 0, 0.4);
	padding: 0 30px;
	margin: 0;
	/*border-bottom: 1px solid #eee;*/
}

.main{
	padding: 15px 0px;

}

.articItem {
	border-radius: 0px;
	border: 0px;
	/*border-bottom: 1px solid #ccc;*/
	box-shadow: 0px 0px 0px;
}

.articItem:after {
	content: "";
	position: absolute;
	/*bottom: 1px;*/

	height: 2px;
	width: 0;
	background: #20a0ff;
	transition: all 0.4s ease-in;
	
}

.articItem:hover:after {
	width: 91.5%;
}

.articItem:hover .itemTitle{
	color: #20a0ff;
}

.header{
	padding-left: 10px;
	cursor: pointer;
	text-decoration-line: none;
	font-size: 15px;
}


.articInfor {
	font-size: 10px;
}

.bottom {
	font-size: 13px;
	color: #999;
	float: right;
	padding: 0;
}




</style>
