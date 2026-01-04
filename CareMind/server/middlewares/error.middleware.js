/* eslint-disable no-unused-vars */
const errorMiddleware = (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    details: null
  };

  // Always log full error for debugging / monitoring
  console.error(err);

  /* =======================
     MongoDB / Mongoose
  ======================= */

  // Invalid ObjectId
  if (err.name === "CastError") {
    error = {
      statusCode: 404,
      message: "Resource not found",
      details: null
    };
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = {
      statusCode: 409,
      message: `Duplicate value for '${field}'`,
      details: null
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error = {
      statusCode: 400,
      message: "Validation failed",
      details: Object.values(err.errors).map(e => e.message)
    };
  }

  /* =======================
     Authentication / JWT
  ======================= */

  if (err.name === "JsonWebTokenError") {
    error = {
      statusCode: 401,
      message: "Invalid token",
      details: null
    };
  }

  if (err.name === "TokenExpiredError") {
    error = {
      statusCode: 401,
      message: "Token expired",
      details: null
    };
  }

  /* =======================
     Request / Parsing
  ======================= */

  // Invalid JSON
  if (err.type === "entity.parse.failed") {
    error = {
      statusCode: 400,
      message: "Invalid JSON payload",
      details: null
    };
  }

  // Payload too large
  if (err.type === "entity.too.large") {
    error = {
      statusCode: 413,
      message: "Request payload too large",
      details: null
    };
  }

  /* =======================
     File Upload (Multer)
  ======================= */

  if (err.code === "LIMIT_FILE_SIZE") {
    error = {
      statusCode: 400,
      message: "File size limit exceeded",
      details: null
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error = {
      statusCode: 400,
      message: "Unexpected file upload",
      details: null
    };
  }

  /* =======================
     Rate Limiting
  ======================= */

  if (err.status === 429) {
    error = {
      statusCode: 429,
      message: "Too many requests",
      details: null
    };
  }

  /* =======================
     Final Response
  ======================= */

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    details: error.details
  });
};

export default errorMiddleware;
