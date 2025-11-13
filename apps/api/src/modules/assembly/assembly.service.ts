import { Injectable, NotFoundException, ForbiddenException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CreateAssemblyDto,
  UpdateAssemblyDto,
  CreateAssemblyItemDto,
  CastVoteDto,
  QueryAssemblyDto,
} from './dto/assembly.dto';
import { Prisma, AssemblyStatus } from '@prisma/client';
import { GamificationHelper } from '../gamification/gamification.helper';

@Injectable()
export class AssemblyService {
  private readonly logger = new Logger(AssemblyService.name);

  constructor(
    private prisma: PrismaService,
    private gamificationHelper: GamificationHelper,
  ) {}

  // ==========================================
  // ASSEMBLEIAS
  // ==========================================

  /**
   * Criar nova assembleia
   */
  async create(condominiumId: string, userId: string, data: CreateAssemblyDto) {
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
      throw new ForbiddenException('Apenas síndicos podem criar assembleias');
    }

    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);

    if (startAt >= endAt) {
      throw new BadRequestException('Data de início deve ser anterior à data de término');
    }

    const assembly = await this.prisma.assembly.create({
      data: {
        condominiumId,
        title: data.title,
        agenda: data.agenda,
        startAt,
        endAt,
        quorumTarget: data.quorumTarget,
        status: AssemblyStatus.SCHEDULED,
      },
    });

    this.logger.log(`Assembleia criada: ${assembly.id} - ${assembly.title}`);

    return assembly;
  }

  /**
   * Listar assembleias
   */
  async findAll(condominiumId: string, query: QueryAssemblyDto) {
    const { page = 1, limit = 20, status, upcomingOnly } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AssemblyWhereInput = { condominiumId };

    if (status) {
      where.status = status;
    }

    if (upcomingOnly) {
      where.startAt = { gte: new Date() };
    }

    const [assemblies, total] = await Promise.all([
      this.prisma.assembly.findMany({
        where,
        include: {
          items: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: { startAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.assembly.count({ where }),
    ]);

    return {
      items: assemblies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar assembleia por ID
   */
  async findOne(condominiumId: string, assemblyId: string) {
    const assembly = await this.prisma.assembly.findFirst({
      where: {
        id: assemblyId,
        condominiumId,
      },
      include: {
        items: {
          include: {
            votes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!assembly) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    // Calcular resultados de votação para cada item
    const itemsWithResults = assembly.items.map(item => {
      const voteCounts = {};
      const options = item.options as any[];

      options.forEach(option => {
        voteCounts[option.id] = 0;
      });

      item.votes.forEach(vote => {
        if (voteCounts[vote.optionId] !== undefined) {
          voteCounts[vote.optionId]++;
        }
      });

      return {
        ...item,
        results: {
          totalVotes: item.votes.length,
          voteCounts,
        },
      };
    });

    return {
      ...assembly,
      items: itemsWithResults,
    };
  }

  /**
   * Atualizar assembleia
   */
  async update(
    condominiumId: string,
    assemblyId: string,
    userId: string,
    data: UpdateAssemblyDto
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
      throw new ForbiddenException('Apenas síndicos podem editar assembleias');
    }

    const existing = await this.prisma.assembly.findFirst({
      where: { id: assemblyId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.agenda) updateData.agenda = data.agenda;
    if (data.startAt) updateData.startAt = new Date(data.startAt);
    if (data.endAt) updateData.endAt = new Date(data.endAt);
    if (data.quorumTarget) updateData.quorumTarget = data.quorumTarget;

    const assembly = await this.prisma.assembly.update({
      where: { id: assemblyId },
      data: updateData,
    });

    this.logger.log(`Assembleia atualizada: ${assemblyId}`);

    return assembly;
  }

  /**
   * Iniciar assembleia
   */
  async start(condominiumId: string, assemblyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Apenas síndicos podem iniciar assembleias');
    }

    const assembly = await this.prisma.assembly.findFirst({
      where: { id: assemblyId, condominiumId },
    });

    if (!assembly) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    if (assembly.status !== AssemblyStatus.SCHEDULED) {
      throw new BadRequestException('Assembleia não está agendada');
    }

    const updated = await this.prisma.assembly.update({
      where: { id: assemblyId },
      data: { status: AssemblyStatus.IN_PROGRESS },
    });

    this.logger.log(`Assembleia iniciada: ${assemblyId}`);

    return updated;
  }

  /**
   * Finalizar assembleia
   */
  async complete(condominiumId: string, assemblyId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Apenas síndicos podem finalizar assembleias');
    }

    const assembly = await this.prisma.assembly.findFirst({
      where: { id: assemblyId, condominiumId },
    });

    if (!assembly) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    if (assembly.status !== AssemblyStatus.IN_PROGRESS) {
      throw new BadRequestException('Assembleia não está em andamento');
    }

    const updated = await this.prisma.assembly.update({
      where: { id: assemblyId },
      data: { status: AssemblyStatus.COMPLETED },
    });

    this.logger.log(`Assembleia finalizada: ${assemblyId}`);

    return updated;
  }

  // ==========================================
  // ITENS DE VOTAÇÃO
  // ==========================================

  /**
   * Criar item de votação
   */
  async createItem(condominiumId: string, userId: string, data: CreateAssemblyItemDto) {
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
      throw new ForbiddenException('Apenas síndicos podem criar itens de votação');
    }

    // Verificar se assembleia existe
    const assembly = await this.prisma.assembly.findFirst({
      where: {
        id: data.assemblyId,
        condominiumId,
      },
    });

    if (!assembly) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    const item = await this.prisma.assemblyItem.create({
      data: {
        assemblyId: data.assemblyId,
        title: data.title,
        description: data.description,
        order: data.order,
        options: data.options,
      },
    });

    this.logger.log(`Item de votação criado: ${item.id} - ${item.title}`);

    return item;
  }

  // ==========================================
  // VOTAÇÃO
  // ==========================================

  /**
   * Registrar voto
   */
  async vote(condominiumId: string, assemblyId: string, userId: string, data: CastVoteDto) {
    // Verificar assembleia
    const assembly = await this.prisma.assembly.findFirst({
      where: {
        id: assemblyId,
        condominiumId,
      },
    });

    if (!assembly) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    if (assembly.status !== AssemblyStatus.IN_PROGRESS) {
      throw new BadRequestException('Assembleia não está em andamento');
    }

    // Verificar item
    const item = await this.prisma.assemblyItem.findFirst({
      where: {
        id: data.itemId,
        assemblyId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item de votação não encontrado');
    }

    // Verificar se opção é válida
    const options = item.options as any[];
    const validOption = options.find(opt => opt.id === data.optionId);
    if (!validOption) {
      throw new BadRequestException('Opção de voto inválida');
    }

    // Verificar se já votou
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        assemblyId_itemId_userId: {
          assemblyId,
          itemId: data.itemId,
          userId,
        },
      },
    });

    if (existingVote) {
      // Atualizar voto
      const vote = await this.prisma.vote.update({
        where: { id: existingVote.id },
        data: { optionId: data.optionId },
      });

      this.logger.log(`Voto atualizado: usuário ${userId} - item ${data.itemId}`);

      return vote;
    }

    // Criar novo voto
    const vote = await this.prisma.vote.create({
      data: {
        assemblyId,
        itemId: data.itemId,
        userId,
        optionId: data.optionId,
      },
    });

    this.logger.log(`Voto registrado: usuário ${userId} - item ${data.itemId} - opção ${data.optionId}`);

    // Adicionar pontos de gamificação
    await this.gamificationHelper.onAssemblyVote(condominiumId, userId, assemblyId);

    return vote;
  }

  /**
   * Resultados de votação de um item
   */
  async getItemResults(condominiumId: string, assemblyId: string, itemId: string) {
    const item = await this.prisma.assemblyItem.findFirst({
      where: {
        id: itemId,
        assembly: {
          id: assemblyId,
          condominiumId,
        },
      },
      include: {
        votes: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Item de votação não encontrado');
    }

    const options = item.options as any[];
    const voteCounts = {};

    options.forEach(option => {
      voteCounts[option.id] = {
        label: option.label,
        count: 0,
      };
    });

    item.votes.forEach(vote => {
      if (voteCounts[vote.optionId]) {
        voteCounts[vote.optionId].count++;
      }
    });

    return {
      itemId: item.id,
      title: item.title,
      totalVotes: item.votes.length,
      results: voteCounts,
    };
  }

  /**
   * Estatísticas
   */
  async getStats(condominiumId: string) {
    const [total, scheduled, inProgress, completed, canceled] = await Promise.all([
      this.prisma.assembly.count({ where: { condominiumId } }),
      this.prisma.assembly.count({ where: { condominiumId, status: AssemblyStatus.SCHEDULED } }),
      this.prisma.assembly.count({ where: { condominiumId, status: AssemblyStatus.IN_PROGRESS } }),
      this.prisma.assembly.count({ where: { condominiumId, status: AssemblyStatus.COMPLETED } }),
      this.prisma.assembly.count({ where: { condominiumId, status: AssemblyStatus.CANCELED } }),
    ]);

    return {
      total,
      scheduled,
      inProgress,
      completed,
      canceled,
    };
  }
}
