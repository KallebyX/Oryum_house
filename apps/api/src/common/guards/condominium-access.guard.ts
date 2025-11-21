import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CONDOMINIUM_KEY } from '../decorators/condominium.decorator';
import { UserRole } from '@prisma/client';

/**
 * Guard that ensures users can only access data from condominiums they belong to
 *
 * Usage:
 * @RequireCondominium()
 * @Get('/tickets')
 * async getTickets(@Param('condominiumId') condominiumId: string) {
 *   // This will only be reached if user has access to condominiumId
 * }
 */
@Injectable()
export class CondominiumAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if this route requires condominium access check
    const requiresCondominiumAccess = this.reflector.getAllAndOverride<boolean>(
      CONDOMINIUM_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If decorator is not present, allow access
    if (!requiresCondominiumAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // User must be authenticated (should be handled by JwtAuthGuard first)
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // ADMIN_GLOBAL has access to all condominiums
    if (user.role === UserRole.ADMIN_GLOBAL) {
      return true;
    }

    // Extract condominiumId from request
    // Can be in params, body, or query
    const condominiumId =
      request.params?.condominiumId ||
      request.body?.condominiumId ||
      request.query?.condominiumId;

    if (!condominiumId) {
      throw new BadRequestException(
        'Condominium ID is required for this operation'
      );
    }

    // Check if user has active membership in this condominium
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: user.sub,
        condominiumId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this condominium'
      );
    }

    // Attach membership to request for later use
    request.membership = membership;

    return true;
  }
}
