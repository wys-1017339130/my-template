module.exports = {
  outputDir: './dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  // 禁止map文件
  productionSourceMap: false,

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': []
      }
    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: false,
      theme: false
    }
  }
}
