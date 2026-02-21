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
  },
  {
    path: '/messages/:receiverId?',
    name: 'messages',
    component: () => import('../views/Messages.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
