import  createApp  from 'vue'
import App from '@/view/pages/default'


import  './assets/css/font-awesome.css'
import  './assets/css/default.css'
import  './assets/css/icon.css'
import  './assets/css/all.css'
import  './assets/css/style.css'
import './assets/css/realgrid-style.css'

console.log(1);
new createApp({
    render: h => h(App)
}).$mount('#application')
