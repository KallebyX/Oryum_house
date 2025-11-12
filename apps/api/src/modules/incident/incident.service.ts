import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateIncidentDto, UpdateIncidentDto, QueryIncidentDto } from './dto/incident.dto';
import { Prisma, IncidentStatus } from '@prisma/client';

@Injectable()
export class IncidentService {
  private readonly logger = new Logger(IncidentService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar novo incidente
   */
  async create(condominiumId: string, userId: string, data: CreateIncidentDto) {
    const incident = await this.prisma.incident.create({
      data: {
        condominiumId,
        reportedById: userId,
        type: data.type,
        title: data.title,
        description: data.description,
        attachments: data.attachments || [],
        status: IncidentStatus.OPEN,
      },
      include: {
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Incidente criado: ${incident.id} - ${data.title}`);

    return incident;
  }

  /**
   * Listar incidentes
   */
  async findAll(condominiumId: string, query: QueryIncidentDto) {
    const { page = 1, limit = 20, type, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.IncidentWhereInput = { condominiumId };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [incidents, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        include: {
          reportedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.incident.count({ where }),
    ]);

    return {
      items: incidents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar incidente por ID
   */
  async findOne(condominiumId: string, incidentId: string) {
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, condominiumId },
      include: {
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException('Incidente não encontrado');
    }

    return incident;
  }

  /**
   * Atualizar incidente (status ou adicionar descrição)
   */
  async update(condominiumId: string, incidentId: string, userId: string, data: UpdateIncidentDto) {
    // Verificar permissão (síndico, zelador, portaria ou reportador)
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, condominiumId },
    });

    if (!incident) {
      throw new NotFoundException('Incidente não encontrado');
    }

    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO', 'ZELADOR', 'PORTARIA'] },
      },
    });

    if (!membership && incident.reportedById !== userId) {
      throw new ForbiddenException('Sem permissão para atualizar este incidente');
    }

    const updateData: any = {};

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.description) {
      // Adicionar atualização à descrição existente
      updateData.description = `${incident.description}\n\n---\n[Atualização ${new Date().toLocaleString('pt-BR')}]:\n${data.description}`;
    }

    const updated = await this.prisma.incident.update({
      where: { id: incidentId },
      data: updateData,
      include: {
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Incidente atualizado: ${incidentId} - Status: ${updated.status}`);

    return updated;
  }

  /**
   * Estatísticas
   */
  async getStats(condominiumId: string) {
    const [total, open, inProgress, resolved, closed] = await Promise.all([
      this.prisma.incident.count({ where: { condominiumId } }),
      this.prisma.incident.count({ where: { condominiumId, status: IncidentStatus.OPEN } }),
      this.prisma.incident.count({ where: { condominiumId, status: IncidentStatus.IN_PROGRESS } }),
      this.prisma.incident.count({ where: { condominiumId, status: IncidentStatus.RESOLVED } }),
      this.prisma.incident.count({ where: { condominiumId, status: IncidentStatus.CLOSED } }),
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
    };
  }
}
