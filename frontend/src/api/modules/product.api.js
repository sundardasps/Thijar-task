import { API_URL } from "../../utils/constants";
import axiosInstance from "../http/axiosInstance";

export const getProductsAPI = (params) =>
  axiosInstance.get(API_URL.PRODUCTS, { params });

export const addProductAPI = (data) =>
  axiosInstance.post(API_URL.PRODUCTS, data);

export const updateProductAPI = ({ id, data }) =>
  axiosInstance.put(`${API_URL.PRODUCTS}/${id}`, data);

export const deleteProductAPI = (id) =>
  axiosInstance.delete(`${API_URL.PRODUCTS}/${id}`);

export const getProductsInfiniteAPI = (params) =>
  axiosInstance.get(`${API_URL.PRODUCTS}/infinite`, { params });

export const getProductsByBarcodeAPI = (barcode) =>
  axiosInstance.get(`${API_URL.PRODUCTS_BARCODE}/${barcode}`);
