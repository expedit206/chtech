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

// réponse reçue
import { useToast } from 'vue-toastification';

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const toast = useToast();

    if (!error.response) {
      toast.error("Erreur de connexion au serveur. Vérifiez votre connexion internet.");
    } else {
      const status = error.response.status;
      if (status >= 500) {
        toast.error("Une erreur interne du serveur s'est produite. Veuillez réessayer plus tard.");
      } else if (status === 401 || status === 403) {
        // Optionnel : ne pas toast 401 pour ne pas spammer si la session expire,
        // mais souvent géré au cas par cas dans le auth store.
      } else if (status === 429) {
        toast.warning("Trop de requêtes. Veuillez patienter.");
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
