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
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register', '/blogs'];
  const authRequired = !publicPages.includes(to.path) && !to.path.startsWith('/produit/');
  const loggedIn = localStorage.getItem('auth_token');

  if (authRequired && !loggedIn) {
    return next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    });
  }

  // Prevent logged in users from visiting login/register
  if (loggedIn && (to.path === '/login' || to.path === '/register')) {
    return next('/');
  }

  next();
});

export default router
