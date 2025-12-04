import multer from "multer";
import fs from "fs";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


export const upload = multer({
  storage,
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
}).single("image");


export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      statusCode: 400,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      statusCode: 400,
      message: "File upload failed.",
      error: err.message,
    });
  }

  next();
};
