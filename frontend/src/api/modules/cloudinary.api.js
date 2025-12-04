import { API_URL } from "../../utils/constants";
import axiosInstance from "../http/axiosInstance";

export const uploadImageAPI = (form) =>
  axiosInstance.post(API_URL.CLOUDINARY_UPLOAD, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteImageAPI = (publicId) =>
  axiosInstance.post(API_URL.CLOUDINARY_DELETE, { publicId });
