import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateNoticeDto, UpdateNoticeDto, QueryNoticeDto, NoticeResponseDto } from './dto/notice.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoticeService {
  private readonly logger = new Logger(NoticeService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar novo comunicado
   */
  async create(condominiumId: string, userId: string, data: CreateNoticeDto) {
    // Verificar se usuário tem permissão (SINDICO ou ADMIN)
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Apenas síndicos podem criar comunicados');
    }

    const notice = await this.prisma.notice.create({
      data: {
        condominiumId,
        title: data.title,
        content: data.content,
        audience: data.audience || 'ALL',
        audienceFilter: data.audienceFilter || null,
        pinned: data.pinned || false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        readConfirmations: true,
      },
    });

    this.logger.log(`Comunicado criado: ${notice.id} - ${notice.title}`);

    return this.mapToResponse(notice, userId);
  }

  /**
   * Listar comunicados com paginação e filtros
   */
  async findAll(condominiumId: string, userId: string, query: QueryNoticeDto) {
    const { page = 1, limit = 20, search, pinnedOnly, publishedOnly, includeExpired } = query;
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.NoticeWhereInput = {
      condominiumId,
    };

    // Filtro de busca
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtro de fixados
    if (pinnedOnly) {
      where.pinned = true;
    }

    // Filtro de publicados
    if (publishedOnly) {
      where.publishedAt = { lte: new Date() };
    }

    // Filtro de expirados
    if (!includeExpired) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ];
    }

    // Buscar comunicados
    const [notices, total] = await Promise.all([
      this.prisma.notice.findMany({
        where,
        include: {
          readConfirmations: true,
        },
        orderBy: [
          { pinned: 'desc' },
          { publishedAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.notice.count({ where }),
    ]);

    const items = notices.map(notice => this.mapToResponse(notice, userId));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar comunicado por ID
   */
  async findOne(condominiumId: string, noticeId: string, userId: string) {
    const notice = await this.prisma.notice.findFirst({
      where: {
        id: noticeId,
        condominiumId,
      },
      include: {
        readConfirmations: {
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
    });

    if (!notice) {
      throw new NotFoundException('Comunicado não encontrado');
    }

    return this.mapToResponse(notice, userId);
  }

  /**
   * Atualizar comunicado
   */
  async update(condominiumId: string, noticeId: string, userId: string, data: UpdateNoticeDto) {
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
      throw new ForbiddenException('Apenas síndicos podem editar comunicados');
    }

    // Verificar se existe
    const existing = await this.prisma.notice.findFirst({
      where: { id: noticeId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Comunicado não encontrado');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.audience !== undefined) updateData.audience = data.audience;
    if (data.audienceFilter !== undefined) updateData.audienceFilter = data.audienceFilter;
    if (data.pinned !== undefined) updateData.pinned = data.pinned;
    if (data.publishedAt !== undefined) updateData.publishedAt = new Date(data.publishedAt);
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    const notice = await this.prisma.notice.update({
      where: { id: noticeId },
      data: updateData,
      include: {
        readConfirmations: true,
      },
    });

    this.logger.log(`Comunicado atualizado: ${notice.id}`);

    return this.mapToResponse(notice, userId);
  }

  /**
   * Excluir comunicado
   */
  async remove(condominiumId: string, noticeId: string, userId: string) {
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
      throw new ForbiddenException('Apenas síndicos podem excluir comunicados');
    }

    // Verificar se existe
    const existing = await this.prisma.notice.findFirst({
      where: { id: noticeId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Comunicado não encontrado');
    }

    await this.prisma.notice.delete({
      where: { id: noticeId },
    });

    this.logger.log(`Comunicado excluído: ${noticeId}`);

    return { success: true, message: 'Comunicado excluído com sucesso' };
  }

  /**
   * Confirmar leitura de comunicado
   */
  async confirmRead(condominiumId: string, noticeId: string, userId: string) {
    // Verificar se comunicado existe
    const notice = await this.prisma.notice.findFirst({
      where: {
        id: noticeId,
        condominiumId,
      },
    });

    if (!notice) {
      throw new NotFoundException('Comunicado não encontrado');
    }

    // Verificar se já confirmou
    const existing = await this.prisma.noticeReadConfirmation.findUnique({
      where: {
        noticeId_userId: {
          noticeId,
          userId,
        },
      },
    });

    if (existing) {
      return { success: true, message: 'Leitura já confirmada anteriormente', alreadyRead: true };
    }

    // Criar confirmação
    await this.prisma.noticeReadConfirmation.create({
      data: {
        noticeId,
        userId,
      },
    });

    this.logger.log(`Leitura confirmada: usuário ${userId} leu comunicado ${noticeId}`);

    return { success: true, message: 'Leitura confirmada com sucesso', alreadyRead: false };
  }

  /**
   * Buscar usuários que leram o comunicado
   */
  async getReaders(condominiumId: string, noticeId: string, userId: string) {
    // Verificar se comunicado existe
    const notice = await this.prisma.notice.findFirst({
      where: {
        id: noticeId,
        condominiumId,
      },
    });

    if (!notice) {
      throw new NotFoundException('Comunicado não encontrado');
    }

    // Buscar confirmações
    const confirmations = await this.prisma.noticeReadConfirmation.findMany({
      where: { noticeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        readAt: 'desc',
      },
    });

    return {
      total: confirmations.length,
      readers: confirmations.map(c => ({
        userId: c.user.id,
        userName: c.user.name,
        userEmail: c.user.email,
        readAt: c.readAt,
      })),
    };
  }

  /**
   * Estatísticas de comunicados
   */
  async getStats(condominiumId: string) {
    const [total, pinned, published, expired] = await Promise.all([
      this.prisma.notice.count({ where: { condominiumId } }),
      this.prisma.notice.count({ where: { condominiumId, pinned: true } }),
      this.prisma.notice.count({
        where: {
          condominiumId,
          publishedAt: { lte: new Date() },
        },
      }),
      this.prisma.notice.count({
        where: {
          condominiumId,
          expiresAt: { lt: new Date() },
        },
      }),
    ]);

    return {
      total,
      pinned,
      published,
      expired,
      active: published - expired,
    };
  }

  /**
   * Mapear para DTO de resposta
   */
  private mapToResponse(notice: any, userId?: string): NoticeResponseDto {
    return {
      id: notice.id,
      condominiumId: notice.condominiumId,
      title: notice.title,
      content: notice.content,
      audience: notice.audience,
      audienceFilter: notice.audienceFilter,
      pinned: notice.pinned,
      publishedAt: notice.publishedAt,
      expiresAt: notice.expiresAt,
      createdAt: notice.createdAt,
      updatedAt: notice.updatedAt,
      readCount: notice.readConfirmations?.length || 0,
      hasRead: userId ? notice.readConfirmations?.some((r: any) => r.userId === userId) : undefined,
    };
  }
}
