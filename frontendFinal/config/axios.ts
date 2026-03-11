import axios from "axios";

// ===========================
// AXIOS INSTANCE
// ===========================

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "production" 
    ? (import.meta.env.VITE_API_URL || "https://your-backend-url.onrender.com/api") 
    : "http://localhost:5000/api",
  withCredentials: true,
});
