import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto, QueryDocumentDto } from './dto/document.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar novo documento
   */
  async create(condominiumId: string, userId: string, data: CreateDocumentDto) {
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
      throw new ForbiddenException('Apenas síndicos podem criar documentos');
    }

    const document = await this.prisma.document.create({
      data: {
        condominiumId,
        createdById: userId,
        title: data.title,
        version: data.version || '1.0',
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        visibility: data.visibility || 'ALL',
        visibilityFilter: data.visibilityFilter,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Documento criado: ${document.id} - ${document.title}`);

    return document;
  }

  /**
   * Listar documentos
   */
  async findAll(condominiumId: string, userId: string, query: QueryDocumentDto) {
    const { page = 1, limit = 20, search, mimeType } = query;
    const skip = (page - 1) * limit;

    // Buscar membership do usuário para verificar visibilidade
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
      },
    });

    const where: Prisma.DocumentWhereInput = {
      condominiumId,
      // Filtrar por visibilidade
      OR: [
        { visibility: 'ALL' },
        {
          AND: [
            { visibility: 'ROLE' },
            {
              visibilityFilter: {
                path: ['roles'],
                array_contains: membership?.role,
              },
            },
          ],
        },
      ],
    };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (mimeType) {
      where.mimeType = mimeType;
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: {
          createdBy: {
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
      this.prisma.document.count({ where }),
    ]);

    return {
      items: documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar documento por ID
   */
  async findOne(condominiumId: string, documentId: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        condominiumId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    // Verificar visibilidade
    if (document.visibility !== 'ALL') {
      const membership = await this.prisma.membership.findFirst({
        where: {
          userId,
          condominiumId,
          isActive: true,
        },
      });

      if (document.visibility === 'ROLE') {
        const allowedRoles = (document.visibilityFilter as any)?.roles || [];
        if (!allowedRoles.includes(membership?.role)) {
          throw new ForbiddenException('Você não tem permissão para acessar este documento');
        }
      }
    }

    return document;
  }

  /**
   * Atualizar documento
   */
  async update(
    condominiumId: string,
    documentId: string,
    userId: string,
    data: UpdateDocumentDto
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
      throw new ForbiddenException('Apenas síndicos podem editar documentos');
    }

    const existing = await this.prisma.document.findFirst({
      where: { id: documentId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Documento não encontrado');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.visibilityFilter !== undefined) updateData.visibilityFilter = data.visibilityFilter;

    const document = await this.prisma.document.update({
      where: { id: documentId },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Documento atualizado: ${document.id}`);

    return document;
  }

  /**
   * Excluir documento
   */
  async remove(condominiumId: string, documentId: string, userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        condominiumId,
        isActive: true,
        role: { in: ['ADMIN_GLOBAL', 'SINDICO'] },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Apenas síndicos podem excluir documentos');
    }

    const existing = await this.prisma.document.findFirst({
      where: { id: documentId, condominiumId },
    });

    if (!existing) {
      throw new NotFoundException('Documento não encontrado');
    }

    await this.prisma.document.delete({
      where: { id: documentId },
    });

    this.logger.log(`Documento excluído: ${documentId}`);

    return { success: true, message: 'Documento excluído com sucesso' };
  }

  /**
   * Estatísticas
   */
  async getStats(condominiumId: string) {
    const [total, pdfs, images, others] = await Promise.all([
      this.prisma.document.count({ where: { condominiumId } }),
      this.prisma.document.count({ where: { condominiumId, mimeType: { startsWith: 'application/pdf' } } }),
      this.prisma.document.count({ where: { condominiumId, mimeType: { startsWith: 'image/' } } }),
      this.prisma.document.count({
        where: {
          condominiumId,
          AND: [
            { mimeType: { not: { startsWith: 'application/pdf' } } },
            { mimeType: { not: { startsWith: 'image/' } } },
          ],
        },
      }),
    ]);

    return {
      total,
      pdfs,
      images,
      others,
    };
  }
}
