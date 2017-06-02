import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/user/Login'
import Index from '@/components/admin/Index'
import AddArticle from '@/components/article/AddArticle'
import ManageArticle from '@/components/article/ManageArticle'
import ManageArtiType from '@/components/article/ManageArtiType'
import ManagePictures from '@/components/pictures/ManagePictures'
import ManageGuestBook from '@/components/other/ManageGuestBook'
import ManageComments from '@/components/article/ManageComments'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/index', name: 'index', component: Index },
		{ path: '/login', name: 'login', component: Login },
		{ path: '/addArticle', name: 'addArticle', component: AddArticle,},
		{ path: '/manageArticle', name: 'manageArticle', component: ManageArticle,},
		{ path: '/manageArtiType', name: 'manageArtiType', component: ManageArtiType,},
		{ path: '/managePictures', name: 'managePictures', component: ManagePictures,},
		{ path: '/manageGuestBook', name: 'manageGuestBook', component: ManageGuestBook,},
		{ path: '/manageComments', name: 'manageComments', component: ManageComments,},
	],
})
