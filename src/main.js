import Vue from 'vue'
import App from './App.vue'
import router from './router'
import echarts from 'echarts'
// reset.css
import "./assets/css/reset.css"

// 引入elementui
import ElementUI from 'element-ui'; // js
import 'element-ui/lib/theme-chalk/index.css'; // css

// iconfont.css
import "./assets/fonts/iconfont.css"

// 引入本地存储工具函数
import local from '@/utils/local'
// 中央事件总线bus
Vue.prototype.$bus = new Vue();
// 把echarts挂载在vue的原型上
Vue.prototype.echarts = echarts;


// 全局路由守卫
router.beforeEach((to, from, next) => { // to: 要去的目录路由对象 from：离开的路由， next： 函数，必须调用 才能进入下一步
  // 获取本地token
  let token = local.get('tk');
  let role = local.get('u_r')

  // 判断
  if (token) { // 如果有token 直接放行
    next() // 放行
  } else {
    // 二次判断 如果去的是登录 放行,  如果去的是别的页面 直接跳转到登录页面
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }

  if (to.meta.role && !to.meta.role.includes(role)) {
    alert('哈哈!')
    next('/login')
  }
})


// 注册  
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
