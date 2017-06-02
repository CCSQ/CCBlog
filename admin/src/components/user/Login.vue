<template>
	<div class="row loginDiv">
		<h4><i class="el-icon-information"></i>登陆</h4>
		<div class="innDiv">
			<el-form :label-position="'top'" label-width="15%" :rules="rules" :ref="'login'" :model="user">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="user.name" v-on:blur="checkUser(user.name)"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input type="password" v-model="user.pwd"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="login(user)">登陆</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>

import { mapActions } from 'vuex'
import loginServices from '../../services/login'
// import cookies from 'js-cookie'

export default {
	name: 'login',
	data () {
		return {
			user: {
				name: '',
				pwd: '',
			},
			rules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				pwd: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
				],
			},
		}
	},
	methods: {

		...mapActions({
			// getLog: 'setIsLogin',
			setLogin: 'setLogin'
		}),

		login: function (user) {
			this.$refs.login.validate((valid) => {
				if (valid) {
					loginServices.userLogin(user).then((response) => {
						if (response.body) {
							this.$message({
								message: '登陆成功',
								type: 'success',
							})
							this.setLogin(true)
							// cookies.set('token', res.data, { expires: 7 })
							// console.log()
							window.sessionStorage.token = response.body
							window.location.hash = '#/index'
						} else {
							this.$message({
								message: "密码不正确",
								type: 'error',
							})
						}
					})
				} else {
					this.$message({
						message: "请填写完整",
						type: 'warning',
					})
				}
			})
		},

		checkUser: function (id) {
			loginServices.checkUser(id).then((response) => {
				if (!response.body) {
					this.$message({
						message: "用户不存在",
						type: 'error',
					})
				}
			})
			
		}
	},
}
</script>

<style scoped>
.loginDiv {
	position:relative;
	height: 550px;
	background-color: #fff;
	border-radius: 5px;
	box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
	margin: 100px 100px;
}

.innDiv {
	position:relative;
	margin-top: 13%;
	margin-left: 25%;
	width: 50%;
}

h4 {
	position:relative;
	font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	font-size: 20px;
	margin-top: 2%;
	margin-left: 2%;
}
</style>
