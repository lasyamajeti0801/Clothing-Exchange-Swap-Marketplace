import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File too large. Maximum size allowed is 5MB per image.', 400);
    }
    return errorResponse(res, `Upload error: ${err.message}`, 400);
  }

  if (err.name === 'ZodError') {
    return errorResponse(res, 'Validation error', 422, err.errors);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error. Please try again later.';
  return errorResponse(res, message, statusCode);
};

export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
