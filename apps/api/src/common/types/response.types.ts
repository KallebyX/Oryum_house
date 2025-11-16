import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard pagination metadata
 */
export class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 150 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 8 })
  totalPages: number;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNextPage: boolean;
}

/**
 * Standard paginated response
 */
export class PaginatedResponse<T> {
  @ApiProperty({ description: 'Array of items', isArray: true })
  items: T[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMeta })
  meta: PaginationMeta;

  constructor(items: T[], page: number, limit: number, total: number) {
    this.items = items;
    const totalPages = Math.ceil(total / limit);
    this.meta = {
      page,
      limit,
      total,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }
}

/**
 * Standard success response
 */
export class SuccessResponse {
  @ApiProperty({ description: 'Success status', example: true })
  success: boolean;

  @ApiProperty({ description: 'Success message', example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ description: 'Optional data', required: false })
  data?: any;

  constructor(message: string, data?: any) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

/**
 * Standard error response
 */
export class ErrorResponse {
  @ApiProperty({ description: 'HTTP status code', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'Timestamp of error', example: '2024-01-01T00:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ description: 'Request path', example: '/api/tickets' })
  path: string;

  @ApiProperty({ description: 'HTTP method', example: 'POST' })
  method: string;

  @ApiProperty({ description: 'Error message', example: 'Validation failed' })
  message: string;

  @ApiProperty({ description: 'Error type', example: 'BadRequestException' })
  error?: string;

  @ApiProperty({ description: 'Additional error details', required: false })
  details?: any;

  @ApiProperty({ description: 'Request ID for tracing', required: false, example: 'uuid' })
  requestId?: string;
}
