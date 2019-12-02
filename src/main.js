import Vue from 'vue'
import './cube-ui.js'
import VueRouter from 'vue-router'
import App from './App.vue'
import util from './util'
import './css/aui.css'
import './vant'
import {
  routes
} from './router.js'

Vue.config.productionTip = false
Vue.prototype.util = util
Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  // mode: routerMode,
  strict: process.env.NODE_ENV !== 'production',
  // 滚动行为  只在mode=history  起作用
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  }
})
router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title
  if (title) {
    document.title = title
  }
  // next((vm) => {
  //   if (from.path == '/') {
  //     vm.$router.replace('/menulist');
  //   }
  // })
  next();
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
