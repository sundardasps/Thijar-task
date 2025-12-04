import axios from "axios";
import { authInterceptor } from "./authInterceptor";
import { handleApiError } from "./errorHandler";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Attach token + interceptors
axiosInstance.interceptors.request.use(authInterceptor);
axiosInstance.interceptors.response.use((response) => response, handleApiError);

export default axiosInstance;
