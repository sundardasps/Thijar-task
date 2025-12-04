import { API_URL } from "../../utils/constants";
import axiosInstance from "../http/axiosInstance";

export const loginAPI = (data) => axiosInstance.post(API_URL.LOGIN, data);
export const userAPI = () => axiosInstance.get(API_URL.USER);
export const logoutAPI = () => axiosInstance.post("/auth/logout");
