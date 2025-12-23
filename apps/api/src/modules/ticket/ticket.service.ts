import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WebSocketGateway } from '../../core/websocket/websocket.gateway';
import { TicketStatus, TicketPriority, UserRole } from '@prisma/client';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AssignTicketDto,
  UpdateTicketStatusDto,
  CloseTicketDto,
  TicketSatisfactionDto,
  AddTicketCommentDto,
  TicketFiltersDto
} from './dto/ticket.dto';
import { GamificationHelper } from '../gamification/gamification.helper';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebSocketGateway,
    private gamificationHelper: GamificationHelper,
  ) {}

  async create(userId: string, condominiumId: string, createTicketDto: CreateTicketDto) {
    const { unitId, ...ticketData } = createTicketDto;

    // Verificar se a unidade existe e pertence ao condomínio
    if (unitId) {
      const unit = await this.prisma.unit.findFirst({
        where: {
          id: unitId,
          condominiumId,
          isActive: true,
        },
      });

      if (!unit) {
        throw new NotFoundException('Unidade não encontrada neste condomínio');
      }
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        ...ticketData,
        condominiumId,
        unitId,
        openedById: userId,
      },
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        unit: {
          select: {
            id: true,
            block: true,
            number: true,
          },
        },
        condominium: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Criar histórico de status inicial
    await this.prisma.ticketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        fromStatus: null,
        toStatus: TicketStatus.NOVA,
        byUserId: userId,
        note: 'Demanda criada',
      },
    });

    this.logger.log(`Nova demanda criada: ${ticket.id} por ${userId}`);

    // Enviar notificação WebSocket
    this.websocketGateway.sendTicketUpdate(condominiumId, {
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      openedBy: ticket.openedBy,
      unit: ticket.unit,
      createdAt: ticket.createdAt,
    });

    // Adicionar pontos de gamificação
    await this.gamificationHelper.onTicketCreate(condominiumId, userId, ticket.id);

    return ticket;
  }

  async findAll(condominiumId: string, filters: TicketFiltersDto, userRole: UserRole, userId?: string) {
    const { page, limit, status, priority, category, assignedToId, openedById, q, from, to, sortBy, sortOrder } = filters;

    const where: any = {
      condominiumId,
    };

    // Filtros específicos
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (assignedToId) where.assignedToId = assignedToId;
    if (openedById) where.openedById = openedById;

    // Busca textual
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filtro de datas
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(`${to}T23:59:59.999Z`);
    }

    // Restrições por papel do usuário
    if (userRole === UserRole.MORADOR && userId) {
      // Moradores só veem suas próprias demandas
      where.openedById = userId;
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const result = await this.prisma.paginate('ticket', {
      page,
      limit,
      where,
      orderBy,
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        unit: {
          select: {
            id: true,
            block: true,
            number: true,
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
    });

    return result;
  }

  async findOne(id: string, condominiumId: string, userRole: UserRole, userId?: string) {
    const where: any = {
      id,
      condominiumId,
    };

    // Moradores só podem ver suas próprias demandas
    if (userRole === UserRole.MORADOR && userId) {
      where.openedById = userId;
    }

    const ticket = await this.prisma.ticket.findFirst({
      where,
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        unit: {
          select: {
            id: true,
            block: true,
            number: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            byUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Demanda não encontrada');
    }

    return ticket;
  }

  async update(id: string, condominiumId: string, updateTicketDto: UpdateTicketDto, userId: string, userRole: UserRole) {
    const ticket = await this.findOne(id, condominiumId, userRole, userId);

    // Verificar permissões de edição
    const canEdit = userRole === UserRole.ADMIN_GLOBAL ||
                   userRole === UserRole.SINDICO ||
                   userRole === UserRole.ZELADOR ||
                   (userRole === UserRole.MORADOR && ticket.openedById === userId && ticket.status === TicketStatus.NOVA);

    if (!canEdit) {
      throw new ForbiddenException('Sem permissão para editar esta demanda');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        unit: {
          select: {
            id: true,
            block: true,
            number: true,
          },
        },
      },
    });

    this.logger.log(`Demanda atualizada: ${id} por ${userId}`);

    // Enviar notificação WebSocket
    this.websocketGateway.sendTicketUpdate(condominiumId, {
      id: updatedTicket.id,
      title: updatedTicket.title,
      status: updatedTicket.status,
      priority: updatedTicket.priority,
      category: updatedTicket.category,
      openedBy: updatedTicket.openedBy,
      assignedTo: updatedTicket.assignedTo,
      unit: updatedTicket.unit,
      updatedAt: updatedTicket.updatedAt,
    });

    return updatedTicket;
  }

  async assign(id: string, condominiumId: string, assignTicketDto: AssignTicketDto, userId: string, userRole: UserRole) {
    // Verificar permissões
    if (!['ADMIN_GLOBAL', 'SINDICO', 'ZELADOR'].includes(userRole)) {
      throw new ForbiddenException('Sem permissão para atribuir demandas');
    }

    const ticket = await this.findOne(id, condominiumId, userRole);

    // Verificar se o usuário a ser atribuído existe e tem acesso ao condomínio
    const assignedUser = await this.prisma.user.findFirst({
      where: {
        id: assignTicketDto.assignedToId,
        memberships: {
          some: {
            condominiumId,
            isActive: true,
          },
        },
      },
    });

    if (!assignedUser) {
      throw new NotFoundException('Usuário não encontrado ou sem acesso ao condomínio');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        assignedToId: assignTicketDto.assignedToId,
        status: ticket.status === TicketStatus.NOVA ? TicketStatus.EM_AVALIACAO : ticket.status,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Criar histórico
    await this.prisma.ticketStatusHistory.create({
      data: {
        ticketId: id,
        fromStatus: ticket.status,
        toStatus: updatedTicket.status,
        byUserId: userId,
        note: `Demanda atribuída para ${assignedUser.name}`,
      },
    });

    this.logger.log(`Demanda ${id} atribuída para ${assignTicketDto.assignedToId} por ${userId}`);

    return updatedTicket;
  }

  async updateStatus(id: string, condominiumId: string, updateStatusDto: UpdateTicketStatusDto, userId: string, userRole: UserRole) {
    const ticket = await this.findOne(id, condominiumId, userRole);

    // Verificar permissões
    const canUpdateStatus = userRole === UserRole.ADMIN_GLOBAL ||
                          userRole === UserRole.SINDICO ||
                          userRole === UserRole.ZELADOR ||
                          (ticket.assignedToId === userId);

    if (!canUpdateStatus) {
      throw new ForbiddenException('Sem permissão para alterar status desta demanda');
    }

    // Validar transições de status
    const validTransitions = this.getValidStatusTransitions(ticket.status);
    if (!validTransitions.includes(updateStatusDto.status)) {
      throw new BadRequestException(`Transição de status inválida: ${ticket.status} -> ${updateStatusDto.status}`);
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
        closedAt: updateStatusDto.status === TicketStatus.CONCLUIDA ? new Date() : null,
      },
    });

    // Criar histórico
    await this.prisma.ticketStatusHistory.create({
      data: {
        ticketId: id,
        fromStatus: ticket.status,
        toStatus: updateStatusDto.status,
        byUserId: userId,
        note: updateStatusDto.note,
      },
    });

    this.logger.log(`Status da demanda ${id} alterado para ${updateStatusDto.status} por ${userId}`);

    // Enviar notificação WebSocket específica para mudança de status
    this.websocketGateway.sendTicketStatusChange(condominiumId, id, {
      ticketId: id,
      oldStatus: ticket.status,
      newStatus: updateStatusDto.status,
      changedBy: userId,
      note: updateStatusDto.note,
    });

    // Adicionar pontos se foi completada
    if (updateStatusDto.status === TicketStatus.CONCLUIDA && ticket.assignedToId) {
      await this.gamificationHelper.onTicketComplete(condominiumId, ticket.assignedToId, id);
    }

    return updatedTicket;
  }

  async close(id: string, condominiumId: string, closeTicketDto: CloseTicketDto, userId: string, userRole: UserRole) {
    return this.updateStatus(id, condominiumId, {
      status: TicketStatus.CONCLUIDA,
      note: closeTicketDto.note,
    }, userId, userRole);
  }

  async addSatisfaction(id: string, condominiumId: string, satisfactionDto: TicketSatisfactionDto, userId: string) {
    const ticket = await this.findOne(id, condominiumId, UserRole.MORADOR, userId);

    // Apenas quem abriu a demanda pode avaliar
    if (ticket.openedById !== userId) {
      throw new ForbiddenException('Apenas quem abriu a demanda pode avaliá-la');
    }

    // Demanda deve estar concluída
    if (ticket.status !== TicketStatus.CONCLUIDA) {
      throw new BadRequestException('Apenas demandas concluídas podem ser avaliadas');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        satisfactionScore: satisfactionDto.satisfactionScore,
      },
    });

    // Adicionar comentário se fornecido
    if (satisfactionDto.comment) {
      await this.prisma.ticketComment.create({
        data: {
          ticketId: id,
          authorId: userId,
          message: `Avaliação: ${satisfactionDto.satisfactionScore}/5 - ${satisfactionDto.comment}`,
        },
      });
    }

    this.logger.log(`Avaliação adicionada à demanda ${id}: ${satisfactionDto.satisfactionScore}/5`);

    return updatedTicket;
  }

  async addComment(id: string, condominiumId: string, commentDto: AddTicketCommentDto, userId: string, userRole: UserRole) {
    const ticket = await this.findOne(id, condominiumId, userRole, userId);

    const comment = await this.prisma.ticketComment.create({
      data: {
        ticketId: id,
        authorId: userId,
        message: commentDto.message,
        mentions: commentDto.mentions || [],
        attachments: commentDto.attachments || [],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    this.logger.log(`Comentário adicionado à demanda ${id} por ${userId}`);

    // Enviar notificação WebSocket para comentário
    this.websocketGateway.sendTicketComment(id, {
      id: comment.id,
      message: comment.message,
      author: comment.author,
      mentions: comment.mentions,
      attachments: comment.attachments,
      createdAt: comment.createdAt,
    });

    return comment;
  }

  async getKanbanView(condominiumId: string, userRole: UserRole, userId?: string) {
    const baseWhere: any = { condominiumId };

    // Moradores só veem suas próprias demandas
    if (userRole === UserRole.MORADOR && userId) {
      baseWhere.openedById = userId;
    }

    // Optimize: Use groupBy for counts and findMany in a single batch
    const [ticketsByStatus, tickets] = await Promise.all([
      this.prisma.ticket.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: {
          status: true,
        },
      }),
      this.prisma.ticket.findMany({
        where: baseWhere,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          priority: true,
          status: true,
          location: true,
          createdAt: true,
          updatedAt: true,
          openedBy: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          unit: {
            select: {
              id: true,
              block: true,
              number: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
    ]);

    // Build counts map from groupBy result
    const countsMap = new Map<TicketStatus, number>(
      ticketsByStatus.map(group => [group.status, group._count.status])
    );

    // Group tickets by status in a single pass
    const ticketsByStatusMap = new Map<TicketStatus, typeof tickets>();
    for (const ticket of tickets) {
      const statusTickets = ticketsByStatusMap.get(ticket.status) || [];
      statusTickets.push(ticket);
      ticketsByStatusMap.set(ticket.status, statusTickets);
    }

    // Build kanban with efficient lookup
    const statuses = [
      TicketStatus.NOVA,
      TicketStatus.EM_AVALIACAO,
      TicketStatus.EM_ANDAMENTO,
      TicketStatus.AGUARDANDO_MORADOR,
      TicketStatus.CONCLUIDA,
      TicketStatus.CANCELADA,
    ];

    const kanban = {} as Record<TicketStatus, { count: number; tickets: typeof tickets }>;

    for (const status of statuses) {
      kanban[status] = {
        count: countsMap.get(status) || 0,
        tickets: ticketsByStatusMap.get(status) || [],
      };
    }

    return kanban;
  }

  private getValidStatusTransitions(currentStatus: TicketStatus): TicketStatus[] {
    const transitions = {
      [TicketStatus.NOVA]: [TicketStatus.EM_AVALIACAO, TicketStatus.CANCELADA],
      [TicketStatus.EM_AVALIACAO]: [TicketStatus.EM_ANDAMENTO, TicketStatus.CANCELADA],
      [TicketStatus.EM_ANDAMENTO]: [TicketStatus.AGUARDANDO_MORADOR, TicketStatus.CONCLUIDA, TicketStatus.CANCELADA],
      [TicketStatus.AGUARDANDO_MORADOR]: [TicketStatus.EM_ANDAMENTO, TicketStatus.CONCLUIDA, TicketStatus.CANCELADA],
      [TicketStatus.CONCLUIDA]: [], // Não pode sair do status concluída
      [TicketStatus.CANCELADA]: [TicketStatus.NOVA], // Pode reabrir
    };

    return transitions[currentStatus] || [];
  }

  async getStats(condominiumId: string, userRole: UserRole, userId?: string) {
    const baseWhere: any = { condominiumId };

    if (userRole === UserRole.MORADOR && userId) {
      baseWhere.openedById = userId;
    }

    const [
      total,
      open,
      closed,
      overdue,
      avgSatisfaction,
      categoryStats,
      priorityStats,
    ] = await Promise.all([
      this.prisma.ticket.count({ where: baseWhere }),
      this.prisma.ticket.count({ 
        where: { 
          ...baseWhere, 
          status: { 
            in: [TicketStatus.NOVA, TicketStatus.EM_AVALIACAO, TicketStatus.EM_ANDAMENTO, TicketStatus.AGUARDANDO_MORADOR] 
          } 
        } 
      }),
      this.prisma.ticket.count({ 
        where: { 
          ...baseWhere, 
          status: { 
            in: [TicketStatus.CONCLUIDA, TicketStatus.CANCELADA] 
          } 
        } 
      }),
      this.prisma.ticket.count({
        where: {
          ...baseWhere,
          status: { 
            in: [TicketStatus.NOVA, TicketStatus.EM_AVALIACAO, TicketStatus.EM_ANDAMENTO] 
          },
          createdAt: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h atrás
          },
        },
      }),
      this.prisma.ticket.aggregate({
        where: {
          ...baseWhere,
          satisfactionScore: { not: null },
        },
        _avg: {
          satisfactionScore: true,
        },
      }),
      this.prisma.ticket.groupBy({
        by: ['category'],
        where: baseWhere,
        _count: {
          category: true,
        },
      }),
      this.prisma.ticket.groupBy({
        by: ['priority'],
        where: baseWhere,
        _count: {
          priority: true,
        },
      }),
    ]);

    return {
      total,
      open,
      closed,
      overdue,
      avgSatisfaction: avgSatisfaction._avg.satisfactionScore || 0,
      categoryStats,
      priorityStats,
    };
  }
}
