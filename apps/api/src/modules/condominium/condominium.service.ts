import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { FileUploadService } from '../../core/file-upload/file-upload.service';
import {
  CreateCondominiumDto,
  UpdateCondominiumDto,
  QueryCondominiumDto,
  CondominiumStatsDto,
} from './dto/condominium.dto';
import { Prisma, TicketStatus, BookingStatus, AssemblyStatus } from '@prisma/client';

@Injectable()
export class CondominiumService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  /**
   * Create a new condominium
   */
  async create(createCondominiumDto: CreateCondominiumDto) {
    // Check if CNPJ already exists
    const existingCondominium = await this.prisma.condominium.findFirst({
      where: { cnpj: createCondominiumDto.cnpj },
    });

    if (existingCondominium) {
      throw new ConflictException('Condominium with this CNPJ already exists');
    }

    const condominium = await this.prisma.condominium.create({
      data: createCondominiumDto,
    });

    return condominium;
  }

  /**
   * Find all condominiums with filters and pagination
   */
  async findAll(query: QueryCondominiumDto) {
    const { search, city, state, page = 1, limit = 10 } = query;

    const where: Prisma.CondominiumWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { cnpj: { contains: search } },
        ],
      }),
      ...(city && { city: { equals: city, mode: 'insensitive' } }),
      ...(state && { state: { equals: state, mode: 'insensitive' } }),
    };

    const [condominiums, total] = await Promise.all([
      this.prisma.condominium.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              units: true,
              memberships: true,
            },
          },
        },
      }),
      this.prisma.condominium.count({ where }),
    ]);

    return {
      data: condominiums,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one condominium by ID
   */
  async findOne(id: string) {
    const condominium = await this.prisma.condominium.findUnique({
      where: { id },
      include: {
        units: {
          take: 5,
          orderBy: { number: 'asc' },
        },
        memberships: {
          where: { isActive: true },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            units: true,
            memberships: true,
            tickets: true,
            areas: true,
          },
        },
      },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    return condominium;
  }

  /**
   * Update a condominium
   */
  async update(id: string, updateCondominiumDto: UpdateCondominiumDto) {
    // Check if condominium exists
    const existingCondominium = await this.prisma.condominium.findUnique({
      where: { id },
    });

    if (!existingCondominium) {
      throw new NotFoundException('Condominium not found');
    }

    // If updating CNPJ, check for duplicates
    if (updateCondominiumDto.cnpj && updateCondominiumDto.cnpj !== existingCondominium.cnpj) {
      const duplicateCnpj = await this.prisma.condominium.findFirst({
        where: {
          cnpj: updateCondominiumDto.cnpj,
          id: { not: id },
        },
      });

      if (duplicateCnpj) {
        throw new ConflictException('Condominium with this CNPJ already exists');
      }
    }

    const condominium = await this.prisma.condominium.update({
      where: { id },
      data: updateCondominiumDto,
    });

    return condominium;
  }

  /**
   * Soft delete a condominium
   */
  async remove(id: string) {
    const condominium = await this.prisma.condominium.findUnique({
      where: { id },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    // Soft delete by setting isActive to false
    await this.prisma.condominium.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Condominium deleted successfully' };
  }

  /**
   * Get condominium statistics
   */
  async getStats(id: string): Promise<CondominiumStatsDto> {
    const condominium = await this.prisma.condominium.findUnique({
      where: { id },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    const [
      totalUnits,
      totalResidents,
      openTickets,
      activeBookings,
      activeNotices,
      scheduledAssemblies,
      ticketsWithRating,
    ] = await Promise.all([
      // Total units
      this.prisma.unit.count({
        where: { condominiumId: id },
      }),

      // Total residents (unique users in memberships)
      this.prisma.membership.count({
        where: {
          condominiumId: id,
          isActive: true,
        },
      }),

      // Open tickets
      this.prisma.ticket.count({
        where: {
          condominiumId: id,
          status: {
            notIn: [TicketStatus.CONCLUIDA, TicketStatus.CANCELADA],
          },
        },
      }),

      // Active bookings
      this.prisma.booking.count({
        where: {
          area: { condominiumId: id },
          status: {
            in: [BookingStatus.PENDING, BookingStatus.APPROVED],
          },
          startAt: { gte: new Date() },
        },
      }),

      // Active notices
      this.prisma.notice.count({
        where: {
          condominiumId: id,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } },
          ],
        },
      }),

      // Scheduled assemblies
      this.prisma.assembly.count({
        where: {
          condominiumId: id,
          status: AssemblyStatus.SCHEDULED,
          startAt: { gte: new Date() },
        },
      }),

      // Tickets with ratings for satisfaction calculation
      this.prisma.ticket.findMany({
        where: {
          condominiumId: id,
          status: TicketStatus.CONCLUIDA,
          satisfactionScore: { not: null },
        },
        select: {
          satisfactionScore: true,
        },
      }),
    ]);

    // Calculate average satisfaction
    const averageSatisfaction =
      ticketsWithRating.length > 0
        ? ticketsWithRating.reduce((sum, t) => sum + (t.satisfactionScore || 0), 0) /
          ticketsWithRating.length
        : 0;

    return {
      totalUnits,
      totalResidents,
      openTickets,
      activeBookings,
      activeNotices,
      scheduledAssemblies,
      averageSatisfaction: Math.round(averageSatisfaction * 10) / 10, // Round to 1 decimal
    };
  }

  /**
   * Upload condominium logo
   */
  async uploadLogo(id: string, file: Express.Multer.File) {
    const condominium = await this.prisma.condominium.findUnique({
      where: { id },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPG and PNG are allowed.');
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 2MB limit');
    }

    // Delete old logo if exists
    if (condominium.logoUrl) {
      try {
        await this.fileUploadService.deleteFile(condominium.logoUrl);
      } catch (error) {
        // Log error but don't fail the operation
        console.error('Failed to delete old logo:', error);
      }
    }

    // Upload new logo
    const uploadResult = await this.fileUploadService.uploadFile(
      file,
      `condominiums/${id}/logo`,
    );

    // Update condominium with new logo URL
    const updatedCondominium = await this.prisma.condominium.update({
      where: { id },
      data: { logoUrl: uploadResult.url },
    });

    return updatedCondominium;
  }
}
