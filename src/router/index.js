import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/layout/'),
    children: [
      {
        path: '/',
        name: 'Arena',
        component: () => import('../views/arena')
      }
    ]
  },
  {
    path: '*',
    component: () => import('@/views/erro/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
