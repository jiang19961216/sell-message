/**
 * 接口层
 * 商品模块的所有请求
 */
// 引入工具函数
import req from '../utils/request'


/* 添加商品 */
export const addGoods = params => req.post('/goods/goodsadd', params)

/* 获取商品列表 */
export const getGoodsList = params => req.get('/goods/goodslist', params)

/* 删除商品 */
export const delGoods = params => req.get('/goods/goodsdel', params)

// 商品修改
export const editGoods = params => req.post('/goods/goodsedit', params)