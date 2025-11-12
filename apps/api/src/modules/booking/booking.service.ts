import { Injectable, NotFoundException, ForbiddenException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  QueryBookingDto,
  ApproveRejectBookingDto,
  CheckAvailabilityDto,
  BookingResponseDto,
} from './dto/booking.dto';
import { Prisma, BookingStatus } from '@prisma/client';
import { GamificationHelper } from '../gamification/gamification.helper';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private prisma: PrismaService,
    private gamificationHelper: GamificationHelper,
  ) {}

  /**
   * Criar nova reserva
   */
  async create(condominiumId: string, userId: string, data: CreateBookingDto) {
    // Validar datas
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);

    if (startAt >= endAt) {
      throw new BadRequestException('Data de início deve ser anterior à data de término');
    }

    if (startAt < new Date()) {
      throw new BadRequestException('Não é possível fazer reserva para data passada');
    }

    // Verificar se área existe e está ativa
    const area = await this.prisma.area.findFirst({
      where: {
        id: data.areaId,
        condominiumId,
        isActive: true,
      },
    });

    if (!area) {
      throw new NotFoundException('Área comum não encontrada ou inativa');
    }

    // Verificar se unidade existe
    const unit = await this.prisma.unit.findFirst({
      where: {
        id: data.unitId,
        condominiumId,
        isActive: true,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unidade não encontrada ou inativa');
    }

    // Verificar se usuário tem relação com a unidade
    const hasAccess = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
      },
    });

    if (!hasAccess) {
      throw new ForbiddenException('Você não tem permissão neste condomínio');
    }

    // Verificar conflitos de horário
    const conflict = await this.checkConflict(data.areaId, startAt, endAt);
    if (conflict) {
      throw new BadRequestException(
        'Já existe uma reserva aprovada ou pendente para este horário'
      );
    }

    // Criar reserva
    const booking = await this.prisma.booking.create({
      data: {
        condominiumId,
        areaId: data.areaId,
        unitId: data.unitId,
        requestedById: userId,
        startAt,
        endAt,
        notes: data.notes,
        status: area.requiresApproval ? BookingStatus.PENDING : BookingStatus.APPROVED,
      },
      include: {
        area: true,
        unit: true,
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(
      `Reserva criada: ${booking.id} - Área ${area.name} - Status: ${booking.status}`
    );

    // Adicionar pontos de gamificação
    await this.gamificationHelper.onBookingCreate(condominiumId, userId, booking.id);

    return this.mapToResponse(booking);
  }

  /**
   * Listar reservas com filtros
   */
  async findAll(condominiumId: string, userId: string, query: QueryBookingDto) {
    const { page = 1, limit = 20, areaId, unitId, status, startDate, endDate, myBookings } = query;
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.BookingWhereInput = {
      condominiumId,
    };

    if (areaId) {
      where.areaId = areaId;
    }

    if (unitId) {
      where.unitId = unitId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate) {
      where.startAt = { gte: new Date(startDate) };
    }

    if (endDate) {
      where.endAt = { lte: new Date(endDate) };
    }

    if (myBookings) {
      where.requestedById = userId;
    }

    // Buscar reservas
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          area: true,
          unit: true,
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { startAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    const items = bookings.map(booking => this.mapToResponse(booking));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar reserva por ID
   */
  async findOne(condominiumId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        condominiumId,
      },
      include: {
        area: true,
        unit: true,
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return this.mapToResponse(booking);
  }

  /**
   * Atualizar reserva (apenas se PENDING)
   */
  async update(
    condominiumId: string,
    bookingId: string,
    userId: string,
    data: UpdateBookingDto
  ) {
    // Verificar se existe
    const existing = await this.prisma.booking.findFirst({
      where: { id: bookingId, condominiumId },
      include: { area: true },
    });

    if (!existing) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Apenas o solicitante pode editar
    if (existing.requestedById !== userId) {
      throw new ForbiddenException('Você não pode editar esta reserva');
    }

    // Apenas reservas pendentes podem ser editadas
    if (existing.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Apenas reservas pendentes podem ser editadas'
      );
    }

    const updateData: any = {};

    // Validar e atualizar datas se fornecidas
    if (data.startAt || data.endAt) {
      const startAt = data.startAt ? new Date(data.startAt) : existing.startAt;
      const endAt = data.endAt ? new Date(data.endAt) : existing.endAt;

      if (startAt >= endAt) {
        throw new BadRequestException('Data de início deve ser anterior à data de término');
      }

      if (startAt < new Date()) {
        throw new BadRequestException('Não é possível reservar para data passada');
      }

      // Verificar conflitos (excluindo a própria reserva)
      const conflict = await this.checkConflict(existing.areaId, startAt, endAt, bookingId);
      if (conflict) {
        throw new BadRequestException(
          'Já existe uma reserva aprovada ou pendente para este horário'
        );
      }

      if (data.startAt) updateData.startAt = startAt;
      if (data.endAt) updateData.endAt = endAt;
    }

    if (data.notes !== undefined) updateData.notes = data.notes;

    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        area: true,
        unit: true,
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Reserva atualizada: ${booking.id}`);

    return this.mapToResponse(booking);
  }

  /**
   * Aprovar ou rejeitar reserva (SINDICO/ADMIN)
   */
  async approveOrReject(
    condominiumId: string,
    bookingId: string,
    userId: string,
    data: ApproveRejectBookingDto
  ) {
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
      throw new ForbiddenException('Apenas síndicos podem aprovar/rejeitar reservas');
    }

    // Verificar se existe
    const existing = await this.prisma.booking.findFirst({
      where: { id: bookingId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (existing.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Apenas reservas pendentes podem ser aprovadas/rejeitadas');
    }

    // Validar motivo de rejeição
    if (data.status === BookingStatus.REJECTED && !data.reason) {
      throw new BadRequestException('Motivo de rejeição é obrigatório');
    }

    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: data.status,
        notes: data.reason
          ? `${existing.notes || ''}\n\nMotivo da rejeição: ${data.reason}`.trim()
          : existing.notes,
      },
      include: {
        area: true,
        unit: true,
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(
      `Reserva ${data.status === BookingStatus.APPROVED ? 'aprovada' : 'rejeitada'}: ${booking.id}`
    );

    return this.mapToResponse(booking);
  }

  /**
   * Cancelar reserva
   */
  async cancel(condominiumId: string, bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, condominiumId },
    });

    if (!booking) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Verificar permissão (solicitante ou síndico)
    const isSindico = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (booking.requestedById !== userId && !isSindico) {
      throw new ForbiddenException('Você não pode cancelar esta reserva');
    }

    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('Reserva já está cancelada');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELED },
      include: {
        area: true,
        unit: true,
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Reserva cancelada: ${bookingId}`);

    return this.mapToResponse(updated);
  }

  /**
   * Verificar disponibilidade
   */
  async checkAvailability(condominiumId: string, data: CheckAvailabilityDto) {
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);

    if (startAt >= endAt) {
      throw new BadRequestException('Data de início deve ser anterior à data de término');
    }

    const conflict = await this.checkConflict(data.areaId, startAt, endAt);

    return {
      available: !conflict,
      message: conflict
        ? 'Horário indisponível - já existe reserva para este período'
        : 'Horário disponível',
    };
  }

  /**
   * Estatísticas de reservas
   */
  async getStats(condominiumId: string) {
    const [total, pending, approved, rejected, canceled] = await Promise.all([
      this.prisma.booking.count({ where: { condominiumId } }),
      this.prisma.booking.count({ where: { condominiumId, status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { condominiumId, status: BookingStatus.APPROVED } }),
      this.prisma.booking.count({ where: { condominiumId, status: BookingStatus.REJECTED } }),
      this.prisma.booking.count({ where: { condominiumId, status: BookingStatus.CANCELED } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      canceled,
    };
  }

  /**
   * Verificar conflito de horário
   */
  private async checkConflict(
    areaId: string,
    startAt: Date,
    endAt: Date,
    excludeBookingId?: string
  ): Promise<boolean> {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        areaId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
        OR: [
          // Nova reserva começa durante uma existente
          {
            startAt: { lte: startAt },
            endAt: { gt: startAt },
          },
          // Nova reserva termina durante uma existente
          {
            startAt: { lt: endAt },
            endAt: { gte: endAt },
          },
          // Nova reserva engloba uma existente
          {
            startAt: { gte: startAt },
            endAt: { lte: endAt },
          },
        ],
      },
    });

    return !!conflict;
  }

  /**
   * Mapear para DTO de resposta
   */
  private mapToResponse(booking: any): BookingResponseDto {
    return {
      id: booking.id,
      condominiumId: booking.condominiumId,
      areaId: booking.areaId,
      unitId: booking.unitId,
      requestedById: booking.requestedById,
      startAt: booking.startAt,
      endAt: booking.endAt,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      area: booking.area
        ? {
            id: booking.area.id,
            name: booking.area.name,
            requiresApproval: booking.area.requiresApproval,
            feePlaceholder: booking.area.feePlaceholder,
          }
        : undefined,
      unit: booking.unit
        ? {
            id: booking.unit.id,
            block: booking.unit.block,
            number: booking.unit.number,
          }
        : undefined,
      requestedBy: booking.requestedBy
        ? {
            id: booking.requestedBy.id,
            name: booking.requestedBy.name,
            email: booking.requestedBy.email,
          }
        : undefined,
    };
  }
}
