import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateVisitorPassDto, QueryVisitorPassDto, ValidateVisitorPassDto } from './dto/visitor.dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class VisitorService {
  private readonly logger = new Logger(VisitorService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar novo passe de visitante
   */
  async create(condominiumId: string, userId: string, data: CreateVisitorPassDto) {
    const validFrom = new Date(data.validFrom);
    const validTo = new Date(data.validTo);

    if (validFrom >= validTo) {
      throw new BadRequestException('Data de início deve ser anterior à data de término');
    }

    // Verificar unidade
    const unit = await this.prisma.unit.findFirst({
      where: { id: data.unitId, condominiumId },
    });

    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }

    // Gerar QR token único
    const qrToken = this.generateQRToken();

    const pass = await this.prisma.visitorPass.create({
      data: {
        condominiumId,
        unitId: data.unitId,
        visitorName: data.visitorName,
        document: data.document,
        qrToken,
        validFrom,
        validTo,
      },
      include: {
        unit: true,
      },
    });

    this.logger.log(`Passe de visitante criado: ${pass.id} - ${data.visitorName}`);

    return pass;
  }

  /**
   * Listar passes
   */
  async findAll(condominiumId: string, query: QueryVisitorPassDto) {
    const { page = 1, limit = 20, unitId, activeOnly } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.VisitorPassWhereInput = { condominiumId };

    if (unitId) {
      where.unitId = unitId;
    }

    if (activeOnly) {
      where.usedAt = null;
      where.validTo = { gte: new Date() };
    }

    const [passes, total] = await Promise.all([
      this.prisma.visitorPass.findMany({
        where,
        include: {
          unit: true,
        },
        orderBy: { validFrom: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.visitorPass.count({ where }),
    ]);

    return {
      items: passes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar passe por ID
   */
  async findOne(condominiumId: string, passId: string) {
    const pass = await this.prisma.visitorPass.findFirst({
      where: { id: passId, condominiumId },
      include: {
        unit: true,
      },
    });

    if (!pass) {
      throw new NotFoundException('Passe de visitante não encontrado');
    }

    return pass;
  }

  /**
   * Validar e usar passe de visitante (portaria)
   */
  async validate(condominiumId: string, data: ValidateVisitorPassDto) {
    const pass = await this.prisma.visitorPass.findFirst({
      where: {
        condominiumId,
        qrToken: data.qrToken,
      },
      include: {
        unit: true,
      },
    });

    if (!pass) {
      throw new NotFoundException('Passe inválido ou não encontrado');
    }

    const now = new Date();

    if (pass.usedAt) {
      throw new BadRequestException('Este passe já foi utilizado');
    }

    if (now < pass.validFrom) {
      throw new BadRequestException('Este passe ainda não está válido');
    }

    if (now > pass.validTo) {
      throw new BadRequestException('Este passe está expirado');
    }

    // Marcar como usado
    const updated = await this.prisma.visitorPass.update({
      where: { id: pass.id },
      data: { usedAt: now },
      include: {
        unit: true,
      },
    });

    this.logger.log(`Passe validado: ${updated.id} - Visitante: ${updated.visitorName}`);

    return {
      success: true,
      message: 'Passe validado com sucesso',
      pass: updated,
    };
  }

  /**
   * Estatísticas
   */
  async getStats(condominiumId: string) {
    const [total, active, used, expired] = await Promise.all([
      this.prisma.visitorPass.count({ where: { condominiumId } }),
      this.prisma.visitorPass.count({
        where: {
          condominiumId,
          usedAt: null,
          validTo: { gte: new Date() },
        },
      }),
      this.prisma.visitorPass.count({
        where: {
          condominiumId,
          usedAt: { not: null },
        },
      }),
      this.prisma.visitorPass.count({
        where: {
          condominiumId,
          usedAt: null,
          validTo: { lt: new Date() },
        },
      }),
    ]);

    return { total, active, used, expired };
  }

  /**
   * Gerar token QR único
   */
  private generateQRToken(): string {
    return randomBytes(16).toString('hex'); // 32 caracteres hexadecimais
  }
}
