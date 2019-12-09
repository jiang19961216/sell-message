// 引入工具函数
import req from '../utils/request'

/* 获取店铺数据 */
export const getShopInfo = () => req.get('/shop/shopinfo')

/* 修改店铺信息 */
export const editShop = params => req.post('/shop/shopedit', params)