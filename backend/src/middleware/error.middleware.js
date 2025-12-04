import ApiError from "../utils/ApiError.js";

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err.isJoi) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    statusCode,
    message,
    errors: err.errors || (err.isJoi ? err.details : []),
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export { notFound, errorHandler };
