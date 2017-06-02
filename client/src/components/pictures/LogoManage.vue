<template>
	<div id="logoManage">
		<el-row :gutter="20" v-loading.body="picturesInfors.loading">
			<el-col :span="6" v-for="(img, imgIndex) in picturesInfors">
				<el-card :body-style="{ padding: '0px', }" class="imgLine">
					<i class="el-icon-check deleteImg" @click="setThisImg(img)"></i>
					<i class="el-icon-delete deleteImg" @click="deleteThisImg(img,imgIndex)"></i>
					<center>
						<br><img :src="serverAddr + 'logo/' + img" class="image">
					</center>
				</el-card>
				<br>
			</el-col>
		</el-row>
		<el-upload
			:action="serverAddr + 'pictures/uploadLogo'"
			:accept="fileType"
			:on-success="uploadEd"
		>
			<el-button slot="trigger" size="small" type="primary">选取图片</el-button>
			<!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="clearFiles">清空上传列表</el-button> -->
		</el-upload>
	</div>
</template>

<script>
import pictures from '../../services/pictures'
export default {
	name: 'logoManage',
	data() {
		return {
			fileType: "*",
			// fileType: "image/*",
			serverAddr: process.env.api,
			picturesInfors: []
		}
	},
	methods: {
		setThisImg: function(img,imgIndex) {
			this.$emit('setThisImg', this.serverAddr + 'logo/' + img)
		},

		deleteThisImg: function(imgName,imgIndex) {
			pictures.delLogoPic({imgName:imgName}).then((res) => {
				if (res.data) {
					this.$message({
						message: "删除成功",
						type: 'success',
					})
					this.picturesInfors.splice(imgIndex,1)
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
				this.picturesInfors.push(infor[infor.length - 1])
				this.$message({
					message: "图片上传成功",
					type: 'success',
				})
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
	},

	mounted: function() {
		pictures.getLogoPicList().then((res) => {
			if (res.data) {
				this.picturesInfors = res.data
			}
		})
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
