import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ToolView from '../views/ToolView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/tools/:slug',
    name: 'tool',
    component: ToolView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
