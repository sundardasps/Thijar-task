import { API_URL } from "../../utils/constants";
import axiosInstance from "../http/axiosInstance";

export const getCategoriesAPI = () => axiosInstance.get(API_URL.CATEGORY);
export const addCategoryAPI = (data) => axiosInstance.post(API_URL.CATEGORY, data);
