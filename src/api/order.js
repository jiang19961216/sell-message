/**
 * 接口层
 * 订单管理模块
 */

// 引入工具函数
import req from '../utils/request'

// 获取订单列表
export const getOrderList = params => req.get('/order/orderlist', params)

// 修改订单
export const editOrder = params => req.post('/order/orderedit', params)

// 获取首页订单数据
export const getIndexData = () => req.get('/order/totaldata') 