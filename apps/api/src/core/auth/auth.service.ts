import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@prisma/client';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Usuário já existe com este email');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        // New users start as MORADOR, admin can change later
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    this.logger.log(`Novo usuário registrado: ${email}`);

    return {
      message: 'Usuário criado com sucesso',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with memberships
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
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
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    this.logger.log(`Login realizado: ${email}`);

    return {
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      accessToken,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    this.logger.log(`Senha alterada para usuário: ${user.email}`);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
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
        ownedUnits: {
          where: { isActive: true },
          select: {
            id: true,
            block: true,
            number: true,
            condominium: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });
  }

  // Admin methods
  async createUserWithRole(
    adminId: string,
    userData: RegisterDto & { role: UserRole; condominiumId: string }
  ) {
    // Verify admin permissions
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: {
        memberships: {
          where: {
            condominiumId: userData.condominiumId,
            isActive: true,
          },
        },
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin não encontrado');
    }

    const adminMembership = admin.memberships[0];
    if (!adminMembership || !['ADMIN_GLOBAL', 'SINDICO'].includes(adminMembership.role)) {
      throw new UnauthorizedException('Permissão insuficiente');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Usuário já existe com este email');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Create user and membership in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: userData.email,
          passwordHash,
          name: userData.name,
          phone: userData.phone,
        },
      });

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          condominiumId: userData.condominiumId,
          role: userData.role,
        },
      });

      return { user, membership };
    });

    this.logger.log(`Usuário criado por admin: ${userData.email} com role ${userData.role}`);

    return {
      message: 'Usuário criado com sucesso',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        phone: result.user.phone,
        role: result.membership.role,
      },
    };
  }
}
