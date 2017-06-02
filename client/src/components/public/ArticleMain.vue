<template>
	<div class="articleMain">


		<el-card class="box-card well">
			<div slot="header">
				<h3>{{ $route.params.pageName }}</h3>
			</div>

			<div>
				<el-collapse accordion class="collapse" v-if="title.length != 0" @change="getThisArtic(selectIndex)" v-model="selectIndex">
					<el-collapse-item v-for="(item, index) in title" :name="item.year + '-' + item.month">
						<template slot="title"><span class="title">{{ item.year }}年{{ item.month }}月 </span> <span>(共{{ item.num }}篇文章)</span></template>
						<div v-if="item.articList.length != 0">
							<div v-for="(articItem, articIndex) in item.articList" >
								<el-card class="box-card article-car" v-if="articItem.private == 1">
									<router-link :to="{ name: 'Article', params:{ ID: articItem.ID } }" >
										<div class="pri-title-div">
											{{ articItem.createDay }}日： <span class="article-title">{{ articItem.title }}</span>
											<span class="borrep">浏览:{{ articItem.browseNumber }} | 回复: {{ articItem.relyNumber }}</span>
										</div>
									</router-link>
								</el-card>
								<el-card class="box-card article-car" v-else>
									<router-link :to="{ name: 'Article', params:{ ID: articItem.ID } }" >
										<div class="title-div">
											{{ articItem.createDay }}日： <span class="article-title">{{ articItem.title }}</span>
											<el-tag type="primary" v-for="tag in formatTags(articItem.tags)" >{{ tag }}</el-tag>
										</div>
									</router-link>
									<p class="article-infor">{{ articItem.infor }}</p>
									<span class="borrep">浏览:{{ articItem.browseNumber }} | 回复: {{ articItem.relyNumber }}</span>
								</el-card>
							</div>
						</div>
						<div v-else>
							无文章
						</div>

					</el-collapse-item>
				</el-collapse>
				<div v-else>
					无文章
				</div>
			</div>
		</el-card>






<!--
<br>
<br>
<br> -->
		<!-- <div class="well panel radius"> -->
			<!-- 大分类标题 -->
			<!-- <h3>{{ $route.params.pageName }}</h3> -->

			<!-- 分类数据 -->
			<!-- <div> -->
				<!-- <ul>
					<li class="accordion-list" v-for = '(item, index) in inforList'>
						<router-link :to="{ name: 'Article', params:{ articleId: item.id } }" >
							<h4>{{ item.title }}<small>{{ item.time }}</small></h4>
						</router-link>
						<div v-if="item.type == 'private' && !item.isPwd">
							<div class="row collapse postfix-radius private-pwd">
								<div class="small-9 columns"><input type="password" placeholder="输入密码查看内容" :id="item.id"></div>
								<div class="small-3 columns"><a href="javascript:void(0);" class="button postfix" @click="showPrivateInfor(index, item.id)">提交</a></div>
							</div>
							<div class="addit"><i class="fi-bookmark"></i> {{ typeList[item.type] }}</div>
						</div>
						<div v-else>
							<p class="article">{{ item.infor | substrArticle }}</p>
							<div class="addit">
								<router-link :to="{ name: 'Main', params:{ pagType: item.type, pageName: typeList[item.type] } }" >
									<i class="fi-bookmark"></i> {{ typeList[item.type] }}
								</router-link>
							</div>
						</div>
					</li>
				</ul> -->
		<!-- 	</div>
		</div> -->
	</div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
import article from '../../services/article'

export default {
	name: 'articleMain',
	data () {
		return {
			selectIndex: "",
			title:[], // 信息
			listType: 'all', // 加载的文章类型



			start: 0, // 加载到第几个文章
			leng: 12, // 一次性加载几篇文章
		}
	},
	// computed: mapGetters({
	// 	inforList: 'getInforList',
	// 	typeList: 'getType',
	// }),
	methods: {
		formatTags: function(value) {
			if (value === "") {
				return []
			}
			return value.split(",")
		},

		getThisArtic: function (param) {
			var arrTemp = param.split('-')
			for (var i = 0; i < this.title.length; i++) {
				if (this.title[i].sort === (arrTemp[0] + ''+ arrTemp[1])){
					if (this.title[i].articList.length === 0) {
						article.getArticListByTime({year:arrTemp[0], month:arrTemp[1], type: this.listType}).then((res) => {
							for (var j = 0; j < res.body.length; j++) {
								res.body[j].createDay = new Date(res.body[j].createTime).getDate()

								var date = new Date(res.body[j].lastRely)
								res.body[j].lastRely = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
							}

							res.body.sort(function (a,b) {
								return b.createDay - a.createDay
							})
							this.title[i].articList = res.body
							// console.log(res.body)
						})
					}
					break
				}
			}
		}
		// ...mapActions({
		// 	setList: 'setInforList',
		// 	emptyList: 'emptyInforList',
		// 	setPriPwd: 'setPrivatePwd',
		// }),
		// getListFromServer: function () {
		// 	const opts = {
		// 		start: this.start,
		// 		leng: this.leng,
		// 		listType: this.listType,
		// 	}
		// 	// this.setList(opts)
		// },
		// addListFromServer: function() {
		// 	this.start += this.leng
		// 	this.getListFromServer()
		// },

		// showPrivateInfor:function(index, id) {
		// 	var pwd = $("#" + id).val()
		// 	if (pwd == "") {
		// 		alert("密码不能为空")
		// 		return
		// 	}
		// 	this.setPriPwd({index, id, pwd})
		// }
	},

	mounted: function() {
		this.listType = this.$route.params.pagType
		article.getArticTime({type: this.listType}).then((res) => {
			var tempObj = {}
			for (var i = 0; i < res.body.length; i++) {
				var date = new Date(res.body[i].createTime)
				var year = date.getFullYear()
				var month = date.getMonth()+1
				if (tempObj[year + '' + month]) {
					tempObj[year + '' + month].num ++
				} else {
					tempObj[year + '' + month] = {
						year: year,
						month: month,
						num: 1,
					}
				}
			}
			this.title = []
			for(var item in tempObj) {
				this.title.push({sort: item, num: tempObj[item].num, year: tempObj[item].year, month:tempObj[item].month, articList:[],})
			}
			this.title.sort(function (a,b) {
				return b.sort - a.sort
			})
		})
		// this.getListFromServer()
		// var that = this
		// window.addEventListener('scroll', function () {
		// 	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
		// 	if (scrollTop + window.innerHeight >= $(document).height()) {
		// 		that.addListFromServer()
		// 	}
		// })
		// console.log(this.listType)
	},

	watch: {
		'$route' (to, from) {
			this.listType = to.params.pagType
			article.getArticTime({type: this.listType}).then((res) => {
				var tempObj = {}
				for (var i = 0; i < res.body.length; i++) {
					var date = new Date(res.body[i].createTime)
					var year = date.getFullYear()
					var month = date.getMonth()+1
					if (tempObj[year + '' + month]) {
						tempObj[year + '' + month].num ++
					} else {
						tempObj[year + '' + month] = {
							year: year,
							month: month,
							num: 1,
						}
					}
				}
				this.selectIndex = ""
				this.title = []
				for(var item in tempObj) {
					this.title.push({sort: item, num: tempObj[item].num, year: tempObj[item].year, month:tempObj[item].month, articList:[],})
				}
				this.title.sort(function (a,b) {
					return b.sort - a.sort
				})

			})
			// console.log(this.listType)
			// this.start = 0
			// this.emptyList()
			// this.getListFromServer()
		},
	},
	// filters: {
	// 	substrArticle (value) {
	// 		return value.substr(0,26) + '...'
	// 	}
	// },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.well {
  margin: 0px 10px;
	/*margin-left: 20px;*/
	/*margin-right: 20px;*/
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

.collapse {
	border: 0px;
}

.title {
	font-size: 20px;
}

.box-card {
	padding: 0px;
	border: 0px;
	margin-bottom: 8px;
}

.title-div:hover {
	cursor: pointer;
}

.article-title {
	font-size: 17px;
}

.article-car:hover .article-title {
	color: #20a0ff;
	/*font-size: 20px;*/
}

.title-div:after {
	display: block;
	content: "";
	position: absolute;
	/*bottom: 1px;*/

	height: 2px;
	width: 0;
	background: #20a0ff;
	transition: all 0.4s ease-in;
}

.article-car:hover .title-div:after {
	width: 42%;
}

.borrep {
	font-size: 13px;
	color: #999;
	float: right;
	padding: 0;
}

.article-infor {
	margin: 0px;
}

.pri-title-div {
	cursor: pointer;
}

a {
	text-decoration: none;
}

</style>
