const routes = [{
  path: '/home',
  component: () => import('./page/home'),
  meta: {
    title: '首页'
  }
}]

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '')
})

export {
  routes
}
