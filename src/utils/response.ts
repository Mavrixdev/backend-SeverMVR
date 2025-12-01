import { Response } from 'express';
import { ApiResponse, ErrorResponse } from '../types';

const CREATOR = "https://facebook.com/ntmdz08/";

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> & { cre: string } = {
      success: true,
      message,
      data,
      cre: CREATOR,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Error',
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ErrorResponse & { cre: string } = {
      success: false,
      message,
      error,
      cre: CREATOR,
    };
    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static badRequest(res: Response, message: string = 'Bad request'): Response {
    return this.error(res, message, 400);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }
}
