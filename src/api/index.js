import axios from 'axios'
import store from '../redux/store'
import {message,notification} from 'antd';


const instance = axios.create({
	baseURL: window.API_ROOT,
	timeout: 10000
});
const $http = axios.create({
    baseURL: window.API_ROOT,
    timeout: 10000
});
$http.interceptors.request.use((config) => {
    let token = localStorage.getItem('token')
    if ( token && token.length > 6 ) {
        config.headers.common['hzm-cms-accesstoken'] = token;
    }
    return config;
}, (error) => {
    notification.error({
        message: '操作失败',
        description: '可能是网络问题'
    });
    return Promise.reject(error)
});
$http.interceptors.response.use((response) => {
    if ( response.data && response.data.errcode && (response.data.errcode === 100102 || response.data.errcode === 100101) && !( /login/ig.test( response.config.url ) ) ) {
        message.warning('账号登录超过有效期,请重新登录');
        setTimeout(() => {
            window.location.href = window.location.href.replace(window.location.hash, '#/login')
        }, 800);
        return false
    }else if(response.data && response.data.errcode && (response.data.errcode === 403)) {
        message.error('没有权限获取数据');
    }
    return (response && response.data) || response
}, (error) => {
    notification.error({
        message: '操作失败',
        description: '可能是网络问题'
    });
    return Promise.reject(error)
})
instance.interceptors.request.use((config) => {
	let token = localStorage.getItem('token')
	if ( token && token.length > 6 ) {
		config.headers.common['hzm-cms-accesstoken'] = token;
	}
    store.dispatch({type: 'SHOW_LOADING'})
    	return config;
	}, (error) => {
		store.dispatch({type: 'HIDE_LOADING'});
		message.error('请求错误,请联系管理员');
    	return Promise.reject(error)
});
instance.interceptors.response.use((response) => {
    store.dispatch({type: 'HIDE_LOADING'})
    if ( response.data && response.data.errcode && (response.data.errcode === 100102 || response.data.errcode === 100101) && !( /login/ig.test( response.config.url ) ) ) {
    	message.warning('账号登录超过有效期,请重新登录');
        setTimeout(() => {
        	window.location.href = window.location.href.replace(window.location.hash, '#/login')
        }, 800);
        return false
    }else if(response.data && response.data.errcode && (response.data.errcode === 403)) {
		message.error('没有权限获取数据');
	}
    return (response && response.data) || response
}, (error) => {
    store.dispatch({type: 'HIDE_LOADING'});
    message.error('请求错误,请联系管理员');
    return Promise.reject(error)
})


export default {
	qiniu(data = {}){
		return instance.get('/common/getQiniuToken', {params:data}).then(res=>{
			return res;
		})
	},
	login(data){
		let forms = new FormData(data)
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				forms.append(key,data[key])
			}
		}
		return instance.post('/login', forms)
	},
	createHouse:{
		houseDict( data = {} ){
			return instance.get('/house/dict', {params:data})
		},
		zoneTree( data = {} ){
			return instance.get('/zone/alltree', {params:data})
		},
		zones( data = {} ){
			return instance.get('/house/zones', {params:data})
		},
		communityTree( data = {} ){
			return instance.get('/zone/items', {params:data})
		},
		roomsTree( data = {} ){
			return instance.get('/zone/rooms', {params:data})
		},
		create( data = {} ){
			return instance.post('/house/create', data)
		}
	},
	///common/tree/property
	property(data){
		return instance.get('/house/property', {params:data})
	},
	list(data){
		return instance.get('/house/lists', {params:data})
	},
	quality(data = {}){
		return instance.post('/house/quality', data)
	},//offline
	delete(data = {}){
		return instance.post('/house/offline', data)
	},//recovery
	recovery(data = {}){
		return instance.post('/house/recovery', data)
	},
	///house/detail
	detail(data = {}){
		return instance.get('/house/detail', {params:data})
	},
	///house/checkMobile
	checkMobile(data = {}){
		return instance.get('/house/checkMobile', {params:data})
	},
	//statusManage
	statusManage(data = {}){
		return instance.post('/house/statusManage', data)
	},
	//house/update
	edit(data = {}){
		return instance.post('/house/update', data)
	},
	//userList
    userList(data = {}){
        return instance.get('/house/admin/list', {params:data})
    },
	//userDisable
    userDisable(data = {}){
        return $http.get('/house/admin/disabled', {params:data})
	},
    //userEnable
    userEnable(data = {}){
        return $http.get('/house/admin/enabled', {params:data})
    }
}
