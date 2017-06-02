// 从变量池中获取数据
export function getNavList(state) {
	return state.public.navList
}

export function getShowLoading(state) {
	return state.public.showLoading
}

export function isCanEdit(state) {
	return state.public.isCanEdit
}

export function getInitParam(state) {
	return state.public.initParam
}

// export function getIsLoading(state) {
// 	return state.mainList.isLoading
// }

// export function getInforList(state) {
// 	return state.mainList.inforList
// }

// export function getType(state) {
// 	return state.public.typeName
// }