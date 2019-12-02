/* eslint-disable */
const routes = [{
    path: '*',
    redirect: '/login'
  }, {
    path: '/orderSure',
    component: () => import('./page/orderSure'),
    meta: {
      title: '确认订单'
    }
  },
  {
    path: '/menulist',
    component: () => import('./page/menulist'),
    meta: {
      title: '菜单'
    }
  },
  {
    path: '/login',
    component: () => import('./page/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/orderList',
    component: () => import('./page/orderList/index.vue'),
    meta: {
      title: '订单列表'
    }
  },
  {
    path: '/orderInfo',
    component: () => import('./page/orderInfo'),
    meta: {
      title: '订单详情'
    }
  },
  {
    path: '/returnGoods',
    component: () => import('./page/returnGoods'),
    meta: {
      title: '退货详情'
    }
  },
  {
    path: '/userShoplist',
    component: () => import('./page/userShoplist'),
    meta: {
      title: '选择店铺'
    }
  }
]

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '')
})

export {
  routes
}
