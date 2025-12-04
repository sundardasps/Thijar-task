import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import fs from "fs"

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Image file is required");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path); // delete invalid file
      throw new ApiError(400, "Only JPG, PNG, WEBP images allowed");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: process.env.CLOUDINARY_FOLDER,
      resource_type: "image",
    });

    // Delete the local file after upload
    fs.unlinkSync(req.file.path);

    return res.json(
      new ApiResponse(
        200,
        {
          url: result.secure_url,
          publicId: result.public_id,
        },
        "Upload successful"
      )
    );
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return res.status(500).json(new ApiError(500, "Image upload failed"));
  }
};

export const deleteImage = async (req, res) => {
  try {
     console.log("Request body:", req.body);
    const { publicId } = req.body;

    if (!publicId) {
      throw new ApiError(400, "publicId is required");
    }

    await cloudinary.uploader.destroy(publicId);

    return res.json(new ApiResponse(200, null, "Image deleted successfully"));
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    return res.status(500).json(new ApiError(500, "Image deletion failed"));
  }
};
