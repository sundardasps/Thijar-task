import axiosInstance from "../http/axiosInstance";

export const createSaleAPI = (data) => axiosInstance.post("/sales", data);
export const getSalesAPI = (params) =>
  axiosInstance.get("/sales", { params });
export const getInvoiceAPI = (id) =>
  axiosInstance.get(`/sales/invoice/${id}`);
