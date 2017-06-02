<template>
	<div id="menuManage">
		<div v-for="(item, index) in inforList">
			<el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="checkAllChange($event,item)">{{ item.name }}</el-checkbox>
			<div style="margin: 15px 0;"></div>
			<el-checkbox-group v-model="item.selectVal" @change="checkedItemChange(item)">
				<el-checkbox v-for="(infor, inforIndex) in item.infor" :label="infor.pagType" :key="infor.pagType">{{ infor.pageName }}</el-checkbox>
			</el-checkbox-group>
			<hr>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="changeTheNav">确 定</el-button>
		</div>
	</div>
</template>

<script>
import article from '../../services/article'
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'menuManage',
	props: ["nav"],
	data() {
		return {
			inforList: [
				{
					name: "其他",
					isIndeterminate: false,
					checkAll: false,
					selectVal: [],
					infor: [
						{ pagType: "", pageName: "留言板", linkName: "GuestBook" }
					]
				}
			],
		}
	},
	methods: {
		...mapActions({
			setNavList: 'setNavListToServer',
		}),

		getInforList: function () {
			article.getArticleType().then((res) => {
				var type = {
					name: "文章分类",
					checkAll: true,
					isIndeterminate: true,
					selectVal: [],
					infor: []
				}

				var defaultVal = {
					name: "其他",
					isIndeterminate: false,
					checkAll: false,
					selectVal: [],
					infor: [
						{ pagType: "non", pageName: "留言板", linkName: "GuestBook" }
					]
				}
				for (var i = 0; i < res.body.length; i++) {
					var temp = {}
					temp.linkName = 'ArticleMain'
					temp.pagType = res.body[i].value
					temp.pageName = res.body[i].name
					type.infor.push(temp)
				}

				for (var i = this.nav.length - 1; i >= 0; i--) {
					if (this.nav[i].linkName === 'ArticleMain') {
						type.selectVal.push(this.nav[i].pagType)
					}

					if (this.nav[i].linkName === 'GuestBook') {
						defaultVal.selectVal.push(this.nav[i].pagType)
					}
				}

				type.isIndeterminate = !(type.selectVal.length === 0)
				type.checkAll = (type.selectVal.length === type.infor.length)
				if (type.checkAll) type.isIndeterminate = false

				defaultVal.checkAll = (defaultVal.selectVal.length === defaultVal.infor.length)
				defaultVal.isIndeterminate = !(defaultVal.selectVal.length === 0)
				if (defaultVal.checkAll) defaultVal.isIndeterminate = false

				this.inforList = [
					defaultVal,
					type,
				]

			})

		},

		// 全选
		checkAllChange(event,item) {
			item.selectVal = []
			if (event.target.checked) {
				for (var i = item.infor.length - 1; i >= 0; i--) {
					item.selectVal.push(item.infor[i].pagType)
				}
			}
			item.isIndeterminate = false;
		},

		checkedItemChange(item) {
			item.checkAll = item.selectVal.length === item.infor.length
			item.isIndeterminate = item.selectVal.length > 0 && item.selectVal.length < item.infor.length
		},

		// 提交修改
		changeTheNav() {
			var temp = {}
			for (var i = this.inforList.length - 1; i >= 0; i--) {
				for (var j = this.inforList[i].selectVal.length - 1; j >= 0; j--) {
					for (var k = this.inforList[i].infor.length - 1; k >= 0; k--) {
						if(this.inforList[i].infor[k].pagType === this.inforList[i].selectVal[j]) {
							temp[this.inforList[i].selectVal[j]] = this.inforList[i].infor[k]
							break
						}
					}
				}
			}
			this.setNavList(temp)
		},
	},

	mounted: function() {
		this.getInforList()
	},
}
</script>

<style scoped>


img {
	height: 70px;
}

.imgLine:after {
	content: "";
	position: absolute;

	height: 2px;
	width: 0;
	background: #20a0ff;
	transition: all 0.4s ease-in;
}

.imgLine:hover:after {
	width: 23.5%;
}

.deleteImg {
	float: right;
	margin-right:10px;
	margin-top: 5%;
	display: none;
}
.imgLine:hover .deleteImg {
	display:inline-block;
	cursor: pointer;
}
.copy-url {
	display: none;
}

.imgLine:hover .copy-url {
	display:inline-block;
}
</style>
