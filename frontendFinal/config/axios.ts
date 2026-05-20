import axios from "axios";

// ===========================
// AXIOS INSTANCE
// ===========================

export const axiosInstance = axios.create({
  baseURL: (() => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      const cleanUrl = envUrl.replace(/\/$/, "");
      return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
    }
    return import.meta.env.MODE === "production" 
      ? "https://your-backend-url.onrender.com/api" 
      : "http://localhost:5000/api";
  })(),
  withCredentials: true,
});
