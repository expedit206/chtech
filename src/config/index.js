export const CONFIG = {
  // UUID of the Platform Administrator (First user created)
  // This user will receive all messages from "Contact Seller" buttons on product pages
  ADMIN_UUID: "CHANGE_ME_TO_REAL_ADMIN_UUID", 
  
  // Platform settings
  PLATFORM_NAME: "CH-TECH",
  CURRENCY: "FCFA",

  // Environment-aware URLs
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/api$/, "").replace(/\/$/, ""),
  STORAGE_URL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/api$/, "").replace(/\/$/, "") + "/storage/",
  LOGO_URL: "/logo-sasaye.jpeg",
};
