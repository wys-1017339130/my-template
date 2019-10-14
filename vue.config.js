module.exports = {
  outputDir: './dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  productionSourceMap: false // 禁止map文件
}
