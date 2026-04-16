import { CONFIG } from "../config/index.js";
import axios from "axios";

const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import { useToast } from 'vue-toastification';

// Flag pour éviter les redirections en boucle
let isHandling401 = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const toast = useToast();

    if (!error.response) {
      toast.error("Erreur de connexion au serveur. Vérifiez votre connexion internet.");
    } else {
      const status = error.response.status;

      if (status === 401) {
        // Si un token existe mais que le backend répond 401 → session morte
        const hadToken = !!localStorage.getItem("auth_token");

        if (hadToken && !isHandling401) {
          isHandling401 = true;

          // Purger l'état local
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");

          // Éviter la redirection si on est déjà sur login/register
          const currentPath = window.location.pathname;
          const isAuthPage = ['/login', '/register'].includes(currentPath);

          if (!isAuthPage) {
            toast.warning("Votre session a expiré. Veuillez vous reconnecter.");
            // Redirection propre via window.location pour reset l'état Pinia
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }

          // Reset du flag après un délai pour permettre de futures reconnexions
          setTimeout(() => { isHandling401 = false; }, 3000);
        }
      } else if (status >= 500) {
        toast.error("Une erreur interne du serveur s'est produite. Veuillez réessayer plus tard.");
      } else if (status === 429) {
        toast.warning("Trop de requêtes. Veuillez patienter.");
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
