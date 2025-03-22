import { NextFunction, Request, Response } from 'express';

/**
 * Extended Error interface that includes status code and optional data
 */
interface CustomError extends Error {
  statusCode?: number; // HTTP status code to return
  data?: any; // Additional error data
}

/**
 * Global error handling middleware
 *
 * Processes all errors passed via next(error) and returns a
 * standardized error response to the client
 *
 * @param err - The error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract error details with fallbacks
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const data = err.data || null;

  // Log the error (with stack trace) for debugging
  console.error(`[ERROR] ${statusCode}: ${message}`, err.stack);

  // Return structured error response
  res.status(statusCode).json({
    success: false,
    message,
    data,
    // Only include stack trace in development environment
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
