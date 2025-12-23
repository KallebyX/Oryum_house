import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CreateUnitDto,
  UpdateUnitDto,
  QueryUnitDto,
  UnitStatsDto,
} from './dto/unit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new unit in a condominium
   */
  async create(condominiumId: string, createUnitDto: CreateUnitDto) {
    // Check if condominium exists
    const condominium = await this.prisma.condominium.findUnique({
      where: { id: condominiumId },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    // Check if unit already exists in this condominium (block + number must be unique)
    const existingUnit = await this.prisma.unit.findFirst({
      where: {
        condominiumId,
        block: createUnitDto.block,
        number: createUnitDto.number,
      },
    });

    if (existingUnit) {
      throw new ConflictException(
        'Unit with this block and number already exists in this condominium'
      );
    }

    const unit = await this.prisma.unit.create({
      data: {
        ...createUnitDto,
        condominiumId,
      },
      include: {
        condominium: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return unit;
  }

  /**
   * Find all units in a condominium with filters and pagination
   */
  async findAll(condominiumId: string, query: QueryUnitDto) {
    const { search, block, page = 1, limit = 10 } = query;

    // Check if condominium exists
    const condominium = await this.prisma.condominium.findUnique({
      where: { id: condominiumId },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    const where: Prisma.UnitWhereInput = {
      condominiumId,
      ...(search && {
        OR: [
          { number: { contains: search, mode: 'insensitive' } },
          { block: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(block && { block: { equals: block, mode: 'insensitive' } }),
    };

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ block: 'asc' }, { number: 'asc' }],
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              occupants: true,
              tickets: true,
              deliveries: true,
            },
          },
        },
      }),
      this.prisma.unit.count({ where }),
    ]);

    return {
      data: units,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one unit by ID
   */
  async findOne(condominiumId: string, id: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
      include: {
        condominium: {
          select: {
            id: true,
            name: true,
            street: true,
            number: true,
            city: true,
            state: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        occupants: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            tickets: true,
            deliveries: true,
            visitorPasses: true,
          },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return unit;
  }

  /**
   * Update a unit
   */
  async update(
    condominiumId: string,
    id: string,
    updateUnitDto: UpdateUnitDto,
  ) {
    const existingUnit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!existingUnit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if new block/number conflicts with another unit
    if (updateUnitDto.number || updateUnitDto.block) {
      const conflictingUnit = await this.prisma.unit.findFirst({
        where: {
          condominiumId,
          block: updateUnitDto.block ?? existingUnit.block,
          number: updateUnitDto.number ?? existingUnit.number,
          id: { not: id },
        },
      });

      if (conflictingUnit) {
        throw new ConflictException(
          'Unit with this block and number already exists in this condominium'
        );
      }
    }

    const unit = await this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return unit;
  }

  /**
   * Delete a unit
   */
  async remove(condominiumId: string, id: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if unit has active relationships
    const hasActiveRelations = await this.prisma.unit.findFirst({
      where: { id },
      select: {
        _count: {
          select: {
            tickets: true,
            deliveries: true,
            visitorPasses: true,
          },
        },
      },
    });

    if (
      hasActiveRelations &&
      (hasActiveRelations._count.tickets > 0 ||
        hasActiveRelations._count.deliveries > 0 ||
        hasActiveRelations._count.visitorPasses > 0)
    ) {
      throw new BadRequestException(
        'Cannot delete unit with active tickets, deliveries, or visitor passes'
      );
    }

    await this.prisma.unit.delete({
      where: { id },
    });

    return { message: 'Unit deleted successfully' };
  }

  /**
   * Assign owner to unit
   */
  async assignOwner(condominiumId: string, id: string, ownerId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is a member of this condominium
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: ownerId,
        condominiumId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new BadRequestException(
        'User must be a member of this condominium to be assigned as owner'
      );
    }

    const updatedUnit = await this.prisma.unit.update({
      where: { id },
      data: { ownerId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updatedUnit;
  }

  /**
   * Add occupant to unit
   */
  async addOccupant(condominiumId: string, id: string, occupantId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: occupantId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already an occupant
    const isOccupant = await this.prisma.unit.findFirst({
      where: {
        id,
        occupants: {
          some: { id: occupantId },
        },
      },
    });

    if (isOccupant) {
      throw new ConflictException('User is already an occupant of this unit');
    }

    // Check if user is a member of this condominium
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: occupantId,
        condominiumId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new BadRequestException(
        'User must be a member of this condominium to be added as occupant'
      );
    }

    const updatedUnit = await this.prisma.unit.update({
      where: { id },
      data: {
        occupants: {
          connect: { id: occupantId },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        occupants: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updatedUnit;
  }

  /**
   * Remove occupant from unit
   */
  async removeOccupant(condominiumId: string, id: string, occupantId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if user is an occupant
    const isOccupant = await this.prisma.unit.findFirst({
      where: {
        id,
        occupants: {
          some: { id: occupantId },
        },
      },
    });

    if (!isOccupant) {
      throw new NotFoundException('User is not an occupant of this unit');
    }

    await this.prisma.unit.update({
      where: { id },
      data: {
        occupants: {
          disconnect: { id: occupantId },
        },
      },
    });

    return { message: 'Occupant removed successfully' };
  }

  /**
   * Get occupants of a unit
   */
  async getOccupants(condominiumId: string, id: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    const occupants = await this.prisma.unit.findUnique({
      where: { id },
      select: {
        occupants: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    });

    return occupants?.occupants || [];
  }

  /**
   * Get unit statistics
   */
  async getStats(condominiumId: string, id: string): Promise<UnitStatsDto> {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    const [
      totalTickets,
      totalBookings,
      totalDeliveries,
      totalVisitors,
      occupants,
    ] = await Promise.all([
      // Total tickets
      this.prisma.ticket.count({
        where: { unitId: id },
      }),

      // Total bookings
      this.prisma.booking.count({
        where: { unitId: id },
      }),

      // Total deliveries
      this.prisma.delivery.count({
        where: { unitId: id },
      }),

      // Total visitor passes
      this.prisma.visitorPass.count({
        where: { unitId: id },
      }),

      // Occupants
      this.prisma.unit.findUnique({
        where: { id },
        select: {
          _count: {
            select: {
              occupants: true,
            },
          },
        },
      }),
    ]);

    return {
      totalTickets,
      totalBookings,
      totalDeliveries,
      totalVisitors,
      totalOccupants: occupants?._count.occupants || 0,
    };
  }
}
