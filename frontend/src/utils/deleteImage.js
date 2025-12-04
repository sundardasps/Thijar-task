import axios from "axios";

export const extractPublicId = (url) => {
  if (!url) return "";
  const parts = url.split("/upload/");
  if (parts.length < 2) return "";
  const path = parts[1]; // v12345/thijar/products/abc123.png
  const noVersion = path.substring(path.indexOf("/") + 1); // remove v12345/
  return noVersion.split(".")[0]; // remove extension
};


export const deleteImageFromCloud = async (publicId) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/cloudinary/delete`,
      { publicId }
    );
  } catch (err) {
    console.error("Failed to delete Cloudinary image", err);
  }
};
