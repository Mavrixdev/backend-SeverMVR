import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  Logger.error('Error occurred:', err.message);

  if (err instanceof AppError) {
    ResponseHandler.error(res, err.message, err.statusCode, err.stack);
    return;
  }

  ResponseHandler.error(
    res,
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
};
