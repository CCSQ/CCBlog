<template>
	<div id="managePictures">
		<el-collapse accordion @change="getThisImg(selectIndex)" v-model="selectIndex">
			<el-collapse-item v-for="(picturesInfor, picInIndex) in picturesInfors" :name="picturesInfor.dirName" >
				<template slot="title">{{ picturesInfor.dirName }}</template>
				<el-row :gutter="20" v-loading.body="picturesInfor.loading">
					<el-col :span="6" v-for="(img, imgIndex) in picturesInfor.imgs">
						<el-card :body-style="{ padding: '0px', }" class="imgLine">
							<i class="el-icon-delete deleteImg" @click="deleteThisImg(picturesInfor.dirName + '/' + img,picInIndex,imgIndex)"></i>
							<i class="el-icon-document deleteImg" @click="copyThisUrl(picturesInfor.dirName + '/' + img,picInIndex,imgIndex)"></i>
							<center>
								<br>
								<img :src="serverAddr + 'img/' + picturesInfor.dirName + '/' + img" class="image">
							</center>
						</el-card>
						<br>
					</el-col>
				</el-row>
				<el-upload
					:action="serverAddr + 'pictures/upload' + '/' + picturesInfor.dirName"
					:accept="fileType"
					:on-success="uploadEd"
				>
					<el-button slot="trigger" size="small" type="primary">选取图片</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="clearFiles(picturesInfor.dirName, picInIndex)">清空本文件夹</el-button>
					<el-button style="margin-left: 10px;" size="small" type="danger" @click="deleteDir(picturesInfor.dirName, picInIndex)">删除本文件夹</el-button>
				</el-upload>
			</el-collapse-item>
		</el-collapse>
		<el-button class="addDir" icon="plus" @click="addDir">新建文件夹</el-button>
	</div>
</template>

<script>
import pictures from '../../services/pictures'
export default {
	name: 'managePictures',
	data() {
		return {
			fileType: "*",
			// fileType: "image/*",
			selectIndex: "",
			serverAddr: process.env.api,
			picturesInfors: []
		}
	},
	methods: {
		getThisImg: function(data) {
			if (data) {
				var picturesInfor
				for (var i = this.picturesInfors.length - 1; i >= 0; i--) {
					if (this.picturesInfors[i].dirName === data) {
						if (this.picturesInfors[i].imgs.length > 0) return
						picturesInfor = this.picturesInfors[i]
						break
					}
				}
				picturesInfor.loading = true
				pictures.getPicBydir({dirName:data}).then((res) => {
					picturesInfor.imgs = res.data
					picturesInfor.loading = false
				})
			}
		},

		deleteThisImg: function(deleteImgURL,picInIndex,imgIndex) {
			pictures.deletePicByPath({path:deleteImgURL}).then((res) => {
				if (res.data) {
					this.$message({
						message: "删除成功",
						type: 'success',
					})
					this.picturesInfors[picInIndex].imgs.splice(imgIndex,1)
				} else {
					this.$message({
						message: "删除失败，请重试",
						type: 'error',
					})
				}
			})
		},

		uploadEd: function (res, file, fileList) {
			if (typeof res === "string") {
				var infor = res.split('/')
				for (var i = this.picturesInfors.length - 1; i >= 0; i--) {
					if (this.picturesInfors[i].dirName == infor[infor.length - 2]) {
						this.picturesInfors[i].imgs.push(infor[infor.length - 1])
						this.$message({
							message: "图片上传成功",
							type: 'success',
						})
					}
				}
			} else {
				var msg = "请上传图片图片"
				if (res.msg === 0) {
					msg = "上传失败，请稍后再试"
				}
				this.$message({
					message: msg,
					type: 'error',
				})
			}
		},

		copyThisUrl: function(imgPath) {
			
			if (this.copyTextToClipboard(this.serverAddr + 'img/' + imgPath)) {
				this.$message({
					message: "成功复制URL",
					type: 'success',
				})
			} else {
				this.$message({
					message: "复制失败",
					type: 'error',
				})
			}
		},

		copyTextToClipboard: function(text) {
			var textArea				= document.createElement("textarea")
			textArea.style.position		= 'fixed'
			textArea.style.top			= 0
			textArea.style.left			= 0
			textArea.style.width		= '2em'
			textArea.style.height		= '2em'
			textArea.style.padding		= 0
			textArea.style.border		= 'none'
			textArea.style.outline		= 'none'
			textArea.style.boxShadow	= 'none'
			textArea.style.background	= 'transparent'
			textArea.value				= text

			document.body.appendChild(textArea)

			textArea.select()

			var flag
			try {
				flag = document.execCommand('copy')
				// console.log('复制内容 ' + msg)
			} catch (err) {
				flag = false
				// console.log('不能使用这种方法复制内容')
			}
			document.body.removeChild(textArea)
			return flag
		},

		clearFiles: function (dirName, index) {
			this.$confirm('删除本文件下所有图片？', '删除？', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(({ value }) => {
				pictures.clearFiles({dirName: dirName}).then((res) => {
					if (res.data) {
						this.$message({
							message: "删除成功",
							type: 'success',
						})
						this.picturesInfors[index].imgs = []
					}
				})
			})
		},

		deleteDir: function (dirName,index) {
			this.$confirm('删除本文件夹？', '删除？', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(({ value }) => {
				pictures.deleteDir({dirName: dirName}).then((res) => {
					if (res.data) {
						this.$message({
							message: "删除成功",
							type: 'success',
						})
						this.picturesInfors.splice(index,1)
					}
				})
			})
		},

		addDir: function () {
			this.$prompt('请输入文件夹名', '新建文件夹', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[^\\\\\\/:*?\\"<>|]+$/,
				inputErrorMessage: '文件夹命名不正确'
			}).then(({ value }) => {
				for (var i = this.picturesInfors.length - 1; i >= 0; i--) {
					if (this.picturesInfors[i].dirName == value) {
						this.$message({
							message: "文件夹已存在",
							type: 'error',
						})
						return
					}
				}
				pictures.addDir({dirName: value}).then((res) => {
					if (res.data) {
						this.$message({
							message: "新建成功",
							type: 'success',
						})
						this.picturesInfors.push({dirName: value, loading: false, imgs: []})
						
					}
				})
			})
		}
	},

	mounted: function() {
		pictures.getAllPicDir().then((res) => {
			if (res.data) {
				res.data.forEach((item) => {
					this.picturesInfors.push({
						dirName:item,imgs:[]
					})
				})
			}
		})
	},
}
</script>

<style scoped>
.time {
	font-size: 13px;
	color: #999;
}

.borrep {
	font-size: 13px;
	color: #999;
	float: right;
	padding: 0;
}


.articItem:after {
	content: "";
	position: absolute;
	/*bottom: 1px;*/

	height: 2px;
	width: 0;
	background: #42b983;
	transition: all 0.4s ease-in;
	
}

.articItem:hover:after {
	width: 91.5%;
}

.articItem:hover .articTitle{
	color: #42b983;
}

.articTitle:hover {
	cursor: pointer;
}

.addDir {
	width: 100%;
	border: 1px solid #dfe6ec;
	border-top: 0px;
	border-radius: 0px;
}

.addDir:hover {
	border: 1px solid #dfe6ec;
	border-top: 0px;
}

.addDir:active {
	border: 1px solid #dfe6ec;
	border-top: 0px;
}

.addDir:focus {
	border: 1px solid #dfe6ec;
	border-top: 0px;
}

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
