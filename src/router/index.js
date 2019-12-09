import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 重定向到登录
  {
    path: '/',
    redirect: '/index'
  },
  // 登录
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  // 后端大布局组件
  {
    path: '/index',
    component: () => import('../views/Index.vue'),
    children: [
      // 后台首页 （进入后端 默认看到一个内容）
      {
        path: '',
        component: () => import('../views/Home.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index', title: '后台首页' }
          ]
        }
      },
      // 订单管理
      {
        path: '/index/order',
        component: () => import('../views/Order/Order.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/order', title: '订单管理' }
          ]
        }
      },
      {
        name: 'orderdetail',
        path: '/index/orderdetail',
        component: () => import('../views/Order/OrderDetail.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/orderdetail', title: '订单详情' }
          ]
        }
      },
      // 商品管理
      {
        path: '/index/goodslist',
        component: () => import('../views/Goods/GoodsList.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/goodslist', title: '商品管理' },
            { path: '/index/goodslist', title: '商品列表' }
          ]
        }
      },
      {
        path: '/index/goodsadd',
        component: () => import('../views/Goods/GoodsAdd.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/goodslist', title: '商品管理' },
            { path: '/index/goodsadd', title: '商品添加' },
          ]
        }
      },
      {
        path: '/index/goodsedit',
        component: () => import('../views/Goods/GoodsEdit.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/goodslist', title: '商品管理' },
            { path: '/index/goodsedit', title: '商品编辑' },
          ]
        }
      },
      // 店铺管理
      {
        path: '/index/shop',
        component: () => import('../views/Shop.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/shop', title: '店铺管理' }
          ]
        }
      },
      // 账号管理
      {
        path: '/index/accountlist',
        component: () => import('../views/Account/AccountList.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/accountlist', title: '账号管理' },
            { path: '/index/accountlist', title: '账号列表' }
          ]
        }
      },
      {
        path: '/index/accountadd',
        component: () => import('../views/Account/AccountAdd.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/accountlist', title: '账号管理' },
            { path: '/index/accountadd', title: '账号添加' }
          ]
        }
      },
      {
        path: '/index/passwordmodify',
        component: () => import('../views/Account/PasswordModify.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/accountlist', title: '账号管理' },
            { path: '/index/passwordmodify', title: '密码修改' }
          ]
        }
      },
      {
        path: '/index/personal',
        component: () => import('../views/Account/Personal.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/personal', title: '个人中心' }
          ]
        }
      },
      // 销售统计
      {
        path: '/index/goodstotal',
        component: () => import('../views/Total/GoodsTotal.vue'),
        meta: {
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/goodstotal', title: '销售统计' },
            { path: '/index/goodstotal', title: '商品统计' },
          ],
          role: ['super']
        }
      },
      {
        path: '/index/ordertotal',
        component: () => import('../views/Total/OrderTotal.vue'),
        meta: {
          role: ['super'],
          breadArr: [
            { path: '/index', title: '首页' },
            { path: '/index/goodstotal', title: '销售统计' },
            { path: '/index/ordertotal', title: '订单统计' }
          ]
        }
      }
    ]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
