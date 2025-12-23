import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { FileUploadService } from '../../core/file-upload/file-upload.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  QueryUserDto,
  AddToCondominiumDto,
  UserStatsDto,
} from './dto/user.dto';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    // Create user (don't include password in DTO)
    const { password, ...userData } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Find all users with filters and pagination
   */
  async findAll(query: QueryUserDto) {
    const { search, role, isActive, page = 1, limit = 10 } = query;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { memberships: { some: { role } } }),
      ...(isActive !== undefined && { isActive }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              memberships: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one user by ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        memberships: {
          where: { isActive: true },
          include: {
            condominium: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            ownedUnits: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        memberships: {
          where: { isActive: true },
          include: {
            condominium: true,
          },
        },
      },
    });

    return user;
  }

  /**
   * Update user profile
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Change user password
   */
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Update user avatar
   */
  async updateAvatar(id: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPG and PNG are allowed.');
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 2MB limit');
    }

    // Delete old avatar if exists
    if (user.avatarUrl) {
      try {
        await this.fileUploadService.deleteFile(user.avatarUrl);
      } catch (error) {
        console.error('Failed to delete old avatar:', error);
      }
    }

    // Upload new avatar
    const uploadResult = await this.fileUploadService.uploadFile(
      file,
      `users/${id}/avatar`,
    );

    // Update user with new avatar URL
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { avatarUrl: uploadResult.url },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Soft delete user
   */
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete by setting isActive to false
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User deleted successfully' };
  }

  /**
   * Get user memberships
   */
  async getMemberships(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const memberships = await this.prisma.membership.findMany({
      where: {
        userId: id,
        isActive: true,
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
            logoUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return memberships;
  }

  /**
   * Add user to condominium
   */
  async addToCondominium(id: string, addToCondominiumDto: AddToCondominiumDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if condominium exists
    const condominium = await this.prisma.condominium.findUnique({
      where: { id: addToCondominiumDto.condominiumId },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    // Check if membership already exists
    const existingMembership = await this.prisma.membership.findFirst({
      where: {
        userId: id,
        condominiumId: addToCondominiumDto.condominiumId,
      },
    });

    if (existingMembership) {
      // Reactivate if inactive
      if (!existingMembership.isActive) {
        const membership = await this.prisma.membership.update({
          where: { id: existingMembership.id },
          data: {
            isActive: true,
            role: addToCondominiumDto.role,
          },
          include: {
            condominium: true,
          },
        });
        return membership;
      }

      throw new ConflictException('User is already a member of this condominium');
    }

    // Create membership
    const membership = await this.prisma.membership.create({
      data: {
        userId: id,
        condominiumId: addToCondominiumDto.condominiumId,
        role: addToCondominiumDto.role,
      },
      include: {
        condominium: true,
      },
    });

    return membership;
  }

  /**
   * Remove user from condominium
   */
  async removeFromCondominium(id: string, membershipId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.userId !== id) {
      throw new BadRequestException('Membership does not belong to this user');
    }

    // Soft delete membership
    await this.prisma.membership.update({
      where: { id: membershipId },
      data: { isActive: false },
    });

    return { message: 'User removed from condominium successfully' };
  }

  /**
   * Get user statistics
   */
  async getStats(id: string): Promise<UserStatsDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [
      totalCondominiums,
      totalTickets,
      totalBookings,
      totalVotes,
      gamificationData,
    ] = await Promise.all([
      // Total condominiums
      this.prisma.membership.count({
        where: {
          userId: id,
          isActive: true,
        },
      }),

      // Total tickets created
      this.prisma.ticket.count({
        where: { openedById: id },
      }),

      // Total bookings
      this.prisma.booking.count({
        where: { requestedById: id },
      }),

      // Total votes in assemblies
      this.prisma.vote.count({
        where: { userId: id },
      }),

      // Gamification data
      this.prisma.userPoints.findFirst({
        where: { userId: id },
        select: {
          points: true,
          level: true,
        },
      }),
    ]);

    return {
      totalCondominiums,
      totalTickets,
      totalBookings,
      totalVotes,
      gamificationPoints: gamificationData?.points || 0,
      gamificationLevel: gamificationData?.level || 1,
    };
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
