/**
 * axios请求的工具函数
 * 2019-11-13 by 小貂蝉
 */

// 引入核心库
import axios from 'axios'
import qs from 'qs'
import router from '../router'
import local from '@/utils/local'

// 引入ui组件
import { Message } from 'element-ui'
import Config from 'webpack-chain'

// 设置请求的服务器根路径
axios.defaults.baseURL = 'http://172.16.3.254:5000'
// 设置请求超时
axios.defaults.timeout = 3000;

// 设置请求拦截器（在请求发送出去之前 带上一些东西）
axios.interceptors.request.use(config => {
  // 取出本地token
  let token = local.get('tk')

  if (token) {
    // 在请求头部信息携带token（只有企业中开发 公司后端不同的写法 携带的方式有所区别）
    config.headers.Authorization = `Bearer ${token}`; // 我们是在请求拦截器中携带的 所有请求都会有
  }

  return config;
}, err => Promise.reject(err))

// 设置响应拦截器 在接收到后端的响应结果以后 统一处理
axios.interceptors.response.use(response => {
  // 拦截数据  统一处理
  let { code, msg } = response.data;
  if (code === 0) {
    Message({ type: 'success', message: msg })
  }
  else if (code === 1) {
    Message.error(msg)
  }

  return response
}, err => {

  // // token失效的判断
  // if (err.response && err.response.status === 401) {
  //   router.push('/login') // 跳转到登录
  //   Message.error('token失效，请重新登录！')
  //   return;
  // }

  // Message.error('网络请求发生错误，请稍后再试！')
  // 跳转到登录页面
  Promise.reject(err)
})


// get和post请求
export default {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params })
        .then(response => {
          if (response) {
            resolve(response.data) // 成功
          }
        })
        .catch(err => {
          reject(err) // 失败
        })
    })
  },
  post(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params))
        .then(response => {
          if (response) {
            resolve(response.data) // 成功
          }
        })
        .catch(err => {
          reject(err) // 失败
        })
    })
  }
}

