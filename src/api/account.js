/**
 * 接口层，所有账号管理模块相关的请求函数 都在这里哦！！！
 */

// 引入工具函数
import req from '../utils/request'


/* 添加账号 */
export const addAccount = params => req.post('/users/accountadd', params)

/* 获取账号列表 */
export const getAccountList = params => req.get('/users/accountlist', params)

/* 删除账号 */
export const delAccount = params => req.get('/users/accountdel', params)

/* 批量删除账号 */
export const batchDelAccount = params => req.get('/users/accountbatchdel', params)

/* 修改账号 */
export const editAccount = params => req.post('/users/accountedit', params)

/* 登录请求 */
export const checkLogin = params => req.post('/users/checklogin', params)

/* 验证旧密码 */
export const checkOldPassword = params => req.get('/users/checkoldpwd', params)

/* 修改密码 */
export const editPassword = params => req.post('/users/passwordedit', params)

/* 获取账号信息 */
export const getAccountInfo = () => req.get('/users/accountinfo');

/* 修改头像 */
export const editAvatar = params => req.get('/users/avataredit', params)