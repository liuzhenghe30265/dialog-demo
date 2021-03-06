import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/style/reset.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import 'view-design/dist/styles/iview.css'
import { Modal } from 'view-design'
Vue.component('Modal', Modal)

import '@/utils/DragAndZoom.js'
import '@/utils/DialogDrag.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')