import { ApiProperty, ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsUrl,
  IsBoolean,
  IsEnum,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client';

/**
 * DTO for creating a new user
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Senha (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '(11) 98765-4321',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL do avatar',
    example: 'https://storage.example.com/avatars/user-123.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Role do usuário no sistema',
    enum: UserRole,
    default: UserRole.MORADOR,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.MORADOR;
}

/**
 * DTO for updating user profile
 */
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'email'] as const)) {}

/**
 * DTO for updating user password
 */
export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual',
    example: 'senhaAntiga123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'Nova senha (mínimo 6 caracteres)',
    example: 'senhaNova123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;
}

/**
 * DTO for updating user avatar
 */
export class UpdateAvatarDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar file (max 2MB, formats: jpg, png)',
  })
  file: any;
}

/**
 * DTO for querying users with filters and pagination
 */
export class QueryUserDto {
  @ApiPropertyOptional({
    description: 'Busca por nome ou email',
    example: 'João',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por role',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Filtrar por status ativo',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Itens por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;
}

/**
 * DTO for adding user to condominium
 */
export class AddToCondominiumDto {
  @ApiProperty({
    description: 'ID do condomínio',
    example: 'clxxx123456',
  })
  @IsString()
  @IsNotEmpty()
  condominiumId: string;

  @ApiProperty({
    description: 'Role do usuário no condomínio',
    enum: UserRole,
    example: UserRole.MORADOR,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    description: 'ID da unidade (opcional, para moradores)',
    example: 'clxxx789012',
  })
  @IsOptional()
  @IsString()
  unitId?: string;
}

/**
 * DTO for user profile response (without sensitive data)
 */
export class UserProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * DTO for login
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Senha',
    example: 'senha123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * DTO for user statistics
 */
export class UserStatsDto {
  @ApiProperty({
    description: 'Total de condomínios que o usuário pertence',
    example: 2,
  })
  totalCondominiums: number;

  @ApiProperty({
    description: 'Total de tickets criados',
    example: 15,
  })
  totalTickets: number;

  @ApiProperty({
    description: 'Total de reservas feitas',
    example: 8,
  })
  totalBookings: number;

  @ApiProperty({
    description: 'Total de votos em assembleias',
    example: 5,
  })
  totalVotes: number;

  @ApiProperty({
    description: 'Pontos de gamificação',
    example: 1250,
  })
  gamificationPoints: number;

  @ApiProperty({
    description: 'Nível de gamificação',
    example: 3,
  })
  gamificationLevel: number;
}
