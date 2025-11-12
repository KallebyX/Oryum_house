import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateDeliveryDto, QueryDeliveryDto, PickupDeliveryDto } from './dto/delivery.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Registrar nova entrega
   */
  async create(condominiumId: string, userId: string, data: CreateDeliveryDto) {
    // Verificar se unidade existe
    const unit = await this.prisma.unit.findFirst({
      where: { id: data.unitId, condominiumId },
    });

    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }

    // Gerar código único
    const code = this.generateCode();

    const delivery = await this.prisma.delivery.create({
      data: {
        condominiumId,
        unitId: data.unitId,
        code,
        carrier: data.carrier,
        description: data.description,
        notes: data.notes,
      },
      include: {
        unit: true,
      },
    });

    this.logger.log(`Entrega registrada: ${delivery.id} - Código: ${code} - Unidade: ${unit.block} ${unit.number}`);

    return delivery;
  }

  /**
   * Listar entregas
   */
  async findAll(condominiumId: string, query: QueryDeliveryDto) {
    const { page = 1, limit = 20, unitId, pendingOnly } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DeliveryWhereInput = { condominiumId };

    if (unitId) {
      where.unitId = unitId;
    }

    if (pendingOnly) {
      where.pickedUpAt = null;
    }

    const [deliveries, total] = await Promise.all([
      this.prisma.delivery.findMany({
        where,
        include: {
          unit: true,
          pickedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { receivedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.delivery.count({ where }),
    ]);

    return {
      items: deliveries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar entrega por ID
   */
  async findOne(condominiumId: string, deliveryId: string) {
    const delivery = await this.prisma.delivery.findFirst({
      where: { id: deliveryId, condominiumId },
      include: {
        unit: true,
        pickedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException('Entrega não encontrada');
    }

    return delivery;
  }

  /**
   * Confirmar retirada de entrega
   */
  async pickup(condominiumId: string, userId: string, data: PickupDeliveryDto) {
    // Buscar entrega por código
    const delivery = await this.prisma.delivery.findFirst({
      where: {
        condominiumId,
        code: data.code,
      },
      include: {
        unit: true,
      },
    });

    if (!delivery) {
      throw new NotFoundException('Entrega não encontrada com este código');
    }

    if (delivery.pickedUpAt) {
      throw new BadRequestException('Esta entrega já foi retirada');
    }

    const updated = await this.prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        pickedUpAt: new Date(),
        pickedById: userId,
      },
      include: {
        unit: true,
        pickedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Entrega retirada: ${updated.id} - Código: ${data.code} por usuário ${userId}`);

    return updated;
  }

  /**
   * Estatísticas
   */
  async getStats(condominiumId: string) {
    const [total, pending, pickedUp] = await Promise.all([
      this.prisma.delivery.count({ where: { condominiumId } }),
      this.prisma.delivery.count({ where: { condominiumId, pickedUpAt: null } }),
      this.prisma.delivery.count({ where: { condominiumId, pickedUpAt: { not: null } } }),
    ]);

    return { total, pending, pickedUp };
  }

  /**
   * Gerar código único de 8 caracteres
   */
  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem letras confusas (I, O) e números (0, 1)
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
