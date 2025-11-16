import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponse } from '../types/response.types';

/**
 * Swagger decorator for paginated responses
 * @param model The model class for the items
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResponse, model),
    ApiOkResponse({
      description: 'Paginated list of items',
      schema: {
        allOf: [
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 20 },
                  total: { type: 'number', example: 150 },
                  totalPages: { type: 'number', example: 8 },
                  hasPreviousPage: { type: 'boolean', example: false },
                  hasNextPage: { type: 'boolean', example: true },
                },
              },
            },
          },
        ],
      },
    })
  );
};
