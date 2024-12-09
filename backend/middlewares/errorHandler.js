export const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};


export const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging
    console.error(`[${req.method}] ${req.url} - ${err.message}`);
    if (process.env.NODE_ENV !== "production") {
      console.error(err.stack);
    }
  
    // Set default status code and message
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const isValidationError = err.name === "ValidationError";
    const errorDetails = isValidationError ? Object.values(err.errors).map((e) => e.message) : null;

    // Handle specific types of errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation Error", details: err.details || err.message });
    }
  
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
  
    // Send error response
    const response = {
      error: message,
    };
  
    // Include stack trace in development
    if (process.env.NODE_ENV !== "production") {
      response.stack = err.stack;
    }
  
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
    ...(isValidationError && { details: errorDetails }),
    });
  };
  