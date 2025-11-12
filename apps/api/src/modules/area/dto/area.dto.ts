import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsPositive, MinLength, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAreaDto {
  @ApiProperty({ description: 'Nome da área comum', example: 'Salão de Festas' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Descrição da área', example: 'Salão com capacidade para 50 pessoas' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Regras de uso', example: 'Proibido som após 22h' })
  @IsString()
  @IsOptional()
  rules?: string;

  @ApiPropertyOptional({ description: 'Capacidade máxima de pessoas', example: 50 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Requer aprovação do síndico', default: false })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @ApiPropertyOptional({ description: 'Taxa de reserva (R$)', example: 150.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  feePlaceholder?: number;
}

export class UpdateAreaDto {
  @ApiPropertyOptional({ description: 'Nome da área comum' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição da área' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Regras de uso' })
  @IsString()
  @IsOptional()
  rules?: string;

  @ApiPropertyOptional({ description: 'Capacidade máxima de pessoas' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Requer aprovação do síndico' })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @ApiPropertyOptional({ description: 'Taxa de reserva (R$)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  feePlaceholder?: number;

  @ApiPropertyOptional({ description: 'Área ativa' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class QueryAreaDto {
  @ApiPropertyOptional({ description: 'Página', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Buscar por nome' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar apenas áreas ativas', type: Boolean, default: true })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean = true;
}

export class AreaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  condominiumId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  rules?: string;

  @ApiProperty({ required: false })
  capacity?: number;

  @ApiProperty()
  requiresApproval: boolean;

  @ApiProperty({ required: false })
  feePlaceholder?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: 'Número de reservas ativas' })
  activeBookingsCount?: number;
}
