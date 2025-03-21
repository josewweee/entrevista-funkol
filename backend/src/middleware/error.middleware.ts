import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  data?: any;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const data = err.data || null;

  console.error(`[ERROR] ${statusCode}: ${message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    data,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
