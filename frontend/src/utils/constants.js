export const API_URL = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  LOGOUT: "auth/logout",
  REFRESH: "auth/refresh",
  USER: "auth/user",
  CATEGORY: "categories",
  PRODUCTS:"products",
  CLOUDINARY_UPLOAD:"cloudinary/upload",
  CLOUDINARY_DELETE:"cloudinary/delete",
  PRODUCTS_BARCODE:"products/barcode",
};



/** COMMON OPTION SOURCE */
export const goodsOrServices = ["Goods", "Services"];
export const warehouseOptions = ["Warehouse 1", "Warehouse 2", "Warehouse 3"];
export const unitOptions = ["Box","Kg","Ltr","Nos","Pack","Piece","Set","Unit"]
export const discountTypeOptions = ["Percentage","Amount"]
export const taxModeTypes = ["include", "exclude"]
export const taxTypeOptions = [10,18,28,30]