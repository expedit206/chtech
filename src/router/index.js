import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blogs from '../views/Blogs.vue'
import DetailProduit from '../views/DetailProduit.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: '/produit/:id',
    name: 'DetailProduit',
    component: DetailProduit
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
