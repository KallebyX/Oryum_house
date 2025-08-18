import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { CONDOMINIUM_KEY } from '../decorators/condominium.decorator';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiresCondominium = this.reflector.getAllAndOverride<boolean>(CONDOMINIUM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiresCondominium) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // For ADMIN_GLOBAL, allow access to everything
    if (user.role === UserRole.ADMIN_GLOBAL) {
      return true;
    }

    // Get condominium ID from params, query, or body
    const condominiumId = request.params?.condominiumId || 
                         request.query?.condominiumId || 
                         request.body?.condominiumId;

    if (requiresCondominium && !condominiumId) {
      throw new ForbiddenException('ID do condomínio é obrigatório');
    }

    if (condominiumId) {
      // Check if user has access to this condominium
      const membership = await this.prisma.membership.findUnique({
        where: {
          userId_condominiumId: {
            userId: user.id,
            condominiumId,
          },
        },
      });

      if (!membership || !membership.isActive) {
        throw new ForbiddenException('Acesso negado a este condomínio');
      }

      // Add condominium info to request for later use
      request.user.condominiumId = condominiumId;
      request.user.role = membership.role;

      // Check role requirements
      if (requiredRoles && !requiredRoles.includes(membership.role)) {
        throw new ForbiddenException('Permissão insuficiente para esta ação');
      }
    }

    return true;
  }
}
