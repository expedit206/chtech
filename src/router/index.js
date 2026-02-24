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
    path: "/produit/:id",
    name: "DetailProduit",
    component: DetailProduit,
  },
  {
    path: "/messages/:receiverId?",
    name: "messages",
    component: () => import("../views/Messages.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/profile",
    component: () => import("../Layouts/ProfileLayout.vue"), // Le layout avec la Sidebar
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
    ],
  },
  {
    path: "/ressources",
    children: [
      {
        path: "politique-de-confidentialite", // Correspond à /profile/orders
        name: "Politique de Confidentialité",
        component: () => import("../views/PrivacyPolicy.vue"),
      },
      {
        path: "conditions-generales-d-utilisation",
        name: "Conditions Générales d'Utilisation",
        component: () => import("../views/TermsOfService.vue"),
      },
      {
        path: "mentions-legales",
        name: "Mentions Légales",
        component: () => import("../views/LegalNotice.vue"),
      },
      
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
