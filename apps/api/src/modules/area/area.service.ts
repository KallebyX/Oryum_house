import { Injectable, NotFoundException, ForbiddenException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateAreaDto, UpdateAreaDto, QueryAreaDto, AreaResponseDto } from './dto/area.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AreaService {
  private readonly logger = new Logger(AreaService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova área comum
   */
  async create(condominiumId: string, userId: string, data: CreateAreaDto) {
    // Verificar permissão (SINDICO ou ADMIN)
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Apenas síndicos podem criar áreas comuns');
    }

    // Verificar se já existe área com mesmo nome
    const existing = await this.prisma.area.findFirst({
      where: {
        condominiumId,
        name: data.name,
      },
    });

    if (existing) {
      throw new BadRequestException('Já existe uma área com este nome');
    }

    const area = await this.prisma.area.create({
      data: {
        condominiumId,
        name: data.name,
        description: data.description,
        rules: data.rules,
        capacity: data.capacity,
        requiresApproval: data.requiresApproval ?? false,
        feePlaceholder: data.feePlaceholder,
      },
    });

    this.logger.log(`Área comum criada: ${area.id} - ${area.name}`);

    return this.mapToResponse(area);
  }

  /**
   * Listar áreas comuns com paginação e filtros
   */
  async findAll(condominiumId: string, query: QueryAreaDto) {
    const { page = 1, limit = 20, search, activeOnly } = query;
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.AreaWhereInput = {
      condominiumId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (activeOnly) {
      where.isActive = true;
    }

    // Buscar áreas
    const [areas, total] = await Promise.all([
      this.prisma.area.findMany({
        where,
        include: {
          _count: {
            select: {
              bookings: {
                where: {
                  status: { in: ['PENDING', 'APPROVED'] },
                  endAt: { gte: new Date() },
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.area.count({ where }),
    ]);

    const items = areas.map(area => this.mapToResponse(area));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar área por ID
   */
  async findOne(condominiumId: string, areaId: string) {
    const area = await this.prisma.area.findFirst({
      where: {
        id: areaId,
        condominiumId,
      },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: { in: ['PENDING', 'APPROVED'] },
                endAt: { gte: new Date() },
              },
            },
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundException('Área comum não encontrada');
    }

    return this.mapToResponse(area);
  }

  /**
   * Atualizar área comum
   */
  async update(condominiumId: string, areaId: string, userId: string, data: UpdateAreaDto) {
    // Verificar permissão
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Apenas síndicos podem editar áreas comuns');
    }

    // Verificar se existe
    const existing = await this.prisma.area.findFirst({
      where: { id: areaId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Área comum não encontrada');
    }

    // Verificar nome duplicado (se alterado)
    if (data.name && data.name !== existing.name) {
      const duplicate = await this.prisma.area.findFirst({
        where: {
          condominiumId,
          name: data.name,
          id: { not: areaId },
        },
      });

      if (duplicate) {
        throw new BadRequestException('Já existe uma área com este nome');
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.rules !== undefined) updateData.rules = data.rules;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.requiresApproval !== undefined) updateData.requiresApproval = data.requiresApproval;
    if (data.feePlaceholder !== undefined) updateData.feePlaceholder = data.feePlaceholder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const area = await this.prisma.area.update({
      where: { id: areaId },
      data: updateData,
    });

    this.logger.log(`Área comum atualizada: ${area.id}`);

    return this.mapToResponse(area);
  }

  /**
   * Excluir área comum
   */
  async remove(condominiumId: string, areaId: string, userId: string) {
    // Verificar permissão
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Apenas síndicos podem excluir áreas comuns');
    }

    // Verificar se existe
    const existing = await this.prisma.area.findFirst({
      where: { id: areaId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Área comum não encontrada');
    }

    // Verificar se tem reservas futuras
    const futureBookings = await this.prisma.booking.count({
      where: {
        areaId,
        status: { in: ['PENDING', 'APPROVED'] },
        startAt: { gte: new Date() },
      },
    });

    if (futureBookings > 0) {
      throw new BadRequestException(
        `Não é possível excluir área com ${futureBookings} reserva(s) futura(s). Cancele-as primeiro.`
      );
    }

    await this.prisma.area.delete({
      where: { id: areaId },
    });

    this.logger.log(`Área comum excluída: ${areaId}`);

    return { success: true, message: 'Área comum excluída com sucesso' };
  }

  /**
   * Estatísticas de áreas
   */
  async getStats(condominiumId: string) {
    const [total, active, withFee, requireApproval] = await Promise.all([
      this.prisma.area.count({ where: { condominiumId } }),
      this.prisma.area.count({ where: { condominiumId, isActive: true } }),
      this.prisma.area.count({ where: { condominiumId, feePlaceholder: { gt: 0 } } }),
      this.prisma.area.count({ where: { condominiumId, requiresApproval: true } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      withFee,
      requireApproval,
    };
  }

  /**
   * Mapear para DTO de resposta
   */
  private mapToResponse(area: any): AreaResponseDto {
    return {
      id: area.id,
      condominiumId: area.condominiumId,
      name: area.name,
      description: area.description,
      rules: area.rules,
      capacity: area.capacity,
      requiresApproval: area.requiresApproval,
      feePlaceholder: area.feePlaceholder,
      isActive: area.isActive,
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,
      activeBookingsCount: area._count?.bookings || 0,
    };
  }
}
