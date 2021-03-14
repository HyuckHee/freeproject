// 경로: 루트 디렉토리/vue.config.js
const path = require('path');
const webpack = require('webpack')
// const vueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    configureWebpack: {
        resolve: {
            modules: ['node_modules'],
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': path.join(__dirname, 'src/'),
                'vue$': 'vue/dist/vue.js',
                '$store': path.join(__dirname,'src/assets/js/store'),
                '$com': resolve('src/assets/js/common'),
                '@pages': resolve('src/view/pages'),
                '@layout': resolve('src/view/layout'),
                '@modal': resolve('src/view/modal'),
            }
        },
    }
}
