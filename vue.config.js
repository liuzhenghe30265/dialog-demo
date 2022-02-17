const path = require('path')
module.exports = {
  publicPath: '',
  assetsDir: 'static',
  outputDir: 'dist',
  productionSourceMap: false,
  configureWebpack: config => {
    Object.assign(config, {
      resolve: {
        extensions: ['.js', '.vue', '.json', '.css'],
        alias: {
          '@': path.resolve(__dirname, './src')
        },
        plugins: []
      }
    })
  },
  devServer: {
    open: true,
    // host: '',
    // port: 8080,
    https: false,
    hotOnly: false
    // proxy: {
    //     '/': {
    //         target: '',
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/': ''
    //         }
    //     }
    // }
  }
}
