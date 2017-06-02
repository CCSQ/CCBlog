import Vue from 'vue'
import Router from 'vue-router'

import ArticleMain from '@/components/public/ArticleMain'
import Article from '@/components/article/Article'
import AllType from '@/components/article/AllType'
import AllTags from '@/components/article/AllTags'
import ArticleList from '@/components/public/ArticleList'
import GuestBook from '@/components/other/GuestBook'



Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/ArticleMain/:pagType/:pageName', name: 'ArticleMain', component: ArticleMain },
		{ path: '/Article/:ID', name: 'Article', component: Article },
		{ path: '/AllType', name: 'AllType', component: AllType },
		{ path: '/AllTags', name: 'AllTags', component: AllTags },
		{ path: '/ArticleList/:searchTag/:searchTitleKey', name: 'ArticleList', component: ArticleList },
		{ path: '/GuestBook/:pagType/:pageName', name: 'GuestBook', component: GuestBook },
		
		// { path: '/', name: 'Main', component: Main },

	],
})
