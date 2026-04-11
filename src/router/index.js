import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Blogs from "../views/Blogs.vue";
import DetailProduit from "../views/DetailProduit.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/blogs",
    name: "Blogs",
    component: Blogs,
  },
  {
    path: "/produit/:slug",
    name: "DetailProduit",
    component: DetailProduit,
  },
  {
    path: "/messages/:receiverId?",
    name: "messages",
    component: () => import("../views/Messages.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/profile",
    component: () => import("../Layouts/ProfileLayout.vue"), // Le layout avec la Sidebar
    meta: { requiresAuth: true },
    children: [
      {
        path: "", // Correspond à /profile
        name: "Dashboard",
        component: () => import("../views/Dashboard.vue"),
      },
      {
        path: "orders", // Correspond à /profile/orders
        name: "Orders",
        component: () => import("../views/Orders.vue"),
      },
      {
        path: "wishlist", // Correspond à /profile/wishlist
        name: "Wishlist",
        component: () => import("../views/Wishlist.vue"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("../views/Settings.vue"),
      },
      {
        path: "support",
        name: "Support",
        component: () => import("../views/Support.vue"),
      },
      {
        path: "my-orders",
        name: "my-orders",
        component: () => import("../views/profile/MyOrders.vue"),
      },
      {
        path: "vendeur-orders",
        name: "vendeur-orders",
        component: () => import("../views/profile/SupplierOrders.vue"),
        meta: { requiresVendeur: true },
      },
      {
        path: "my-products",
        name: "my-products",
        component: () => import("../views/profile/MyProducts.vue"),
        meta: { requiresVendeur: true },
      },
      {
        path: ":id/public", // Correspond à /profile/:id/public ou /profile/1/public
        name: "PublicProfile",
        component: () => import("../views/profile/PublicProfile.vue"),
      },
    {
      path: "devenir-vendeur",
      name: "become-vendeur",
      component: () => import("../views/profile/BecomeSupplier.vue"),
    },
    {
      path: "seller/stats",
      name: "seller-stats",
      component: () => import("../views/seller/SellerStats.vue"),
      meta: { requiresVendeur: true },
    },
    {
      path: "seller/shop",
      name: "seller-shop",
      component: () => import("../views/seller/SellerShop.vue"),
      meta: { requiresVendeur: true },
    },
  ],
},
// Admin routes with dedicated layout
{
  path: "/admin",
  component: () => import("../Layouts/AdminLayout.vue"),
  meta: { requiresAuth: true, requiresAdmin: true },
  children: [
    {
      path: "",
      name: "admin-dashboard",
      component: () => import("../views/admin/AdminDashboard.vue"),
    },
    {
      path: "users",
      name: "admin-users",
      component: () => import("../views/admin/AdminUsers.vue"),
    },
    {
      path: "produits",
      name: "admin-products",
      component: () => import("../views/admin/AdminProducts.vue"),
    },
    {
      path: "categories",
      name: "admin-categories",
      component: () => import("../views/admin/AdminCategories.vue"),
    },
    {
      path: "blog",
      name: "admin-blog",
      component: () => import("../views/admin/AdminBlog.vue"),
    },
    {
      path: "finance",
      name: "admin-finance",
      component: () => import("../views/admin/AdminFinance.vue"),
    },
    {
      path: "broadcast",
      name: "admin-broadcast",
      component: () => import("../views/admin/AdminBroadcast.vue"),
    },
    {
      path: "demandes-vendeurs",
      name: "admin-seller-requests",
      component: () => import("../views/admin/AdminSupplierRequests.vue"),
    },
  ],
},
  {
    path: "/ressources",
    children: [
      {
        path: "politique-de-confidentialite",
        name: "politique_de_confidentialite",
        component: () => import("../views/PrivacyPolicy.vue"),
      },
      {
        path: "conditions-generales-d-utilisation",
        name: "conditions_generales_d_utilisation",
        component: () => import("../views/TermsOfService.vue"),
      },
      {
        path: "mentions-legales",
        name: "mentions_legales",
        component: () => import("../views/LegalNotice.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import { useAlertStore } from "../stores/alert.js";
import { useAuthStore } from "../stores/auth.js";

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const alertStore = useAlertStore();
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresVendeur = to.matched.some(record => record.meta.requiresVendeur);
  const loggedIn = authStore.isAuthenticated;

  if (requiresAuth && !loggedIn) {
    alertStore.showAlert({
      title: "Accès Restreint",
      message: "Vous devez être connecté pour accéder à cette page.",
      type: "warning",
      confirmText: "Se connecter",
      cancelText: "Annuler",
      showCancel: true,
      onConfirm: () => {
        next({
          name: "Login",
          query: { redirect: to.fullPath },
        });
      },
      onCancel: () => {
        next(false);
      }
    });
    return;
  }

  // Admin guard
  if (requiresAdmin) {
    // Check store first, then fallback to localStorage to prevent flickering during hydration
    const userData = authStore.user || JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userIsAdmin = userData.role === 'admin';

    if (!loggedIn || !userIsAdmin) {
      return next({ name: "Home" });
    }
  }

  // Vendeur guard
  if (requiresVendeur) {
    const userData = authStore.user || JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userIsVendeur = userData.role === 'vendeur' || userData.role === 'vendeur';
    const userIsAdmin = userData.role === 'admin';

    if (!loggedIn || (!userIsVendeur && !userIsAdmin)) {
      return next({ name: "Dashboard" });
    }
  }

  // Empêcher les utilisateurs connectés de visiter login/register
  if (loggedIn && (to.name === "Login" || to.name === "Register")) {
    return next({ name: "Home" });  
  }

  next();
});

export default router;
