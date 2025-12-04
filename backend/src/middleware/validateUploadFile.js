export const validateUploadFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      statusCode: 400,
      message: "Image file is required.",
    });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Only JPG, PNG, WEBP formats are allowed.",
    });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      statusCode: 400,
      message: "File size exceeds 5MB limit.",
    });
  }

  next();
};
