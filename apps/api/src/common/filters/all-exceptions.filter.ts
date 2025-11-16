import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Error response interface
 */
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error?: string;
  details?: any;
  requestId?: string;
}

/**
 * Global exception filter that catches all errors and returns a standardized response
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Log error with different levels based on status code
    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `${errorResponse.method} ${errorResponse.path} - ${errorResponse.statusCode}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(
        `${errorResponse.method} ${errorResponse.path} - ${errorResponse.statusCode}: ${errorResponse.message}`,
      );
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  /**
   * Build standardized error response
   */
  private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;
    const requestId = request.headers['x-request-id'] as string;

    const baseResponse = {
      timestamp,
      path,
      method,
      requestId,
    };

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, baseResponse);
    }

    // Handle Prisma errors
    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception as any, baseResponse);
    }

    // Handle unknown errors
    return this.handleUnknownError(exception, baseResponse);
  }

  /**
   * Handle HTTP exceptions from NestJS
   */
  private handleHttpException(
    exception: HttpException,
    baseResponse: Partial<ErrorResponse>,
  ): ErrorResponse {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return {
        ...baseResponse,
        statusCode: status,
        message: exceptionResponse,
        error: exception.name,
      } as ErrorResponse;
    }

    const { message, error, ...details } = exceptionResponse as any;

    return {
      ...baseResponse,
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      error: error || exception.name,
      ...(Object.keys(details).length > 0 ? { details } : {}),
    } as ErrorResponse;
  }

  /**
   * Handle Prisma database errors
   */
  private handlePrismaError(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientUnknownRequestError,
    baseResponse: Partial<ErrorResponse>,
  ): ErrorResponse {
    // Prisma known request errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception, baseResponse);
    }

    // Prisma validation errors
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        ...baseResponse,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error in database query',
        error: 'PrismaValidationError',
        details: { originalMessage: exception.message },
      } as ErrorResponse;
    }

    // Prisma unknown request errors
    return {
      ...baseResponse,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected database error occurred',
      error: 'PrismaUnknownError',
    } as ErrorResponse;
  }

  /**
   * Handle known Prisma errors with specific error codes
   */
  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
    baseResponse: Partial<ErrorResponse>,
  ): ErrorResponse {
    const { code, meta } = exception;

    switch (code) {
      case 'P2002':
        // Unique constraint violation
        return {
          ...baseResponse,
          statusCode: HttpStatus.CONFLICT,
          message: `Duplicate entry: ${this.extractFieldFromMeta(meta, 'target')} already exists`,
          error: 'UniqueConstraintViolation',
          details: { field: meta?.target },
        } as ErrorResponse;

      case 'P2025':
        // Record not found
        return {
          ...baseResponse,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          error: 'RecordNotFound',
        } as ErrorResponse;

      case 'P2003':
        // Foreign key constraint violation
        return {
          ...baseResponse,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Foreign key constraint failed',
          error: 'ForeignKeyViolation',
          details: { field: meta?.field_name },
        } as ErrorResponse;

      case 'P2014':
        // Relation violation
        return {
          ...baseResponse,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid relation data',
          error: 'RelationViolation',
        } as ErrorResponse;

      case 'P2000':
        // Value too long
        return {
          ...baseResponse,
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Value too long for field: ${this.extractFieldFromMeta(meta, 'column_name')}`,
          error: 'ValueTooLong',
          details: { field: meta?.column_name },
        } as ErrorResponse;

      default:
        return {
          ...baseResponse,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'A database error occurred',
          error: 'DatabaseError',
          details: { code },
        } as ErrorResponse;
    }
  }

  /**
   * Handle unknown/unexpected errors
   */
  private handleUnknownError(
    exception: unknown,
    baseResponse: Partial<ErrorResponse>,
  ): ErrorResponse {
    const message =
      exception instanceof Error ? exception.message : 'An unexpected error occurred';

    return {
      ...baseResponse,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      error: 'InternalServerError',
    } as ErrorResponse;
  }

  /**
   * Check if error is a Prisma error
   */
  private isPrismaError(exception: unknown): boolean {
    return (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError
    );
  }

  /**
   * Extract field name from Prisma error meta
   */
  private extractFieldFromMeta(meta: any, key: string): string {
    if (!meta || !meta[key]) {
      return 'unknown field';
    }

    const value = meta[key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return String(value);
  }
}
