import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { CondominiumAccessGuard } from '../guards/condominium-access.guard';

export const CONDOMINIUM_KEY = 'condominium';

/**
 * Metadata decorator to mark that a route requires condominium access
 */
export const RequireCondominiumMetadata = () => SetMetadata(CONDOMINIUM_KEY, true);

/**
 * Combined decorator that applies condominium access control
 *
 * This ensures that:
 * 1. User is authenticated (requires JwtAuthGuard to be applied first)
 * 2. User has active membership in the specified condominium
 * 3. ADMIN_GLOBAL users can access any condominium
 *
 * Usage:
 * @RequireCondominium()
 * @Get('/condominiums/:condominiumId/tickets')
 * async getTickets(@Param('condominiumId') condominiumId: string) {
 *   // User has verified access to this condominium
 * }
 */
export const RequireCondominium = () => applyDecorators(
  RequireCondominiumMetadata(),
  UseGuards(CondominiumAccessGuard),
);
