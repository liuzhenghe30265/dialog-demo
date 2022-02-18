import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ElementUI',
    component: resolve => require(['@/views/ElementUI.vue'], resolve),
  },
  {
    path: '/iviewModal',
    name: 'iviewModal',
    component: resolve => require(['@/views/iviewModal.vue'], resolve),
  },
]

const router = new VueRouter({
  routes
})

export default router