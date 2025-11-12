import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID da área comum' })
  @IsString()
  areaId: string;

  @ApiProperty({ description: 'ID da unidade' })
  @IsString()
  unitId: string;

  @ApiProperty({ description: 'Data/hora de início (ISO 8601)', example: '2024-12-15T14:00:00Z' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ description: 'Data/hora de término (ISO 8601)', example: '2024-12-15T22:00:00Z' })
  @IsDateString()
  endAt: string;

  @ApiPropertyOptional({ description: 'Observações sobre a reserva' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'Data/hora de início (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  startAt?: string;

  @ApiPropertyOptional({ description: 'Data/hora de término (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endAt?: string;

  @ApiPropertyOptional({ description: 'Observações sobre a reserva' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ApproveRejectBookingDto {
  @ApiProperty({ description: 'Status da aprovação', enum: [BookingStatus.APPROVED, BookingStatus.REJECTED] })
  @IsEnum([BookingStatus.APPROVED, BookingStatus.REJECTED])
  status: BookingStatus;

  @ApiPropertyOptional({ description: 'Motivo da rejeição (obrigatório se rejeitado)' })
  @IsString()
  @MinLength(10)
  @IsOptional()
  reason?: string;
}

export class QueryBookingDto {
  @ApiPropertyOptional({ description: 'Página', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filtrar por área' })
  @IsString()
  @IsOptional()
  areaId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por unidade' })
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por status', enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Data de início para filtro (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data de fim para filtro (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Apenas minhas reservas', type: Boolean })
  @Type(() => Boolean)
  @IsOptional()
  myBookings?: boolean;
}

export class BookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  condominiumId: string;

  @ApiProperty()
  areaId: string;

  @ApiProperty()
  unitId: string;

  @ApiProperty()
  requestedById: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: 'Informações da área' })
  area?: {
    id: string;
    name: string;
    requiresApproval: boolean;
    feePlaceholder?: number;
  };

  @ApiProperty({ description: 'Informações da unidade' })
  unit?: {
    id: string;
    block: string;
    number: string;
  };

  @ApiProperty({ description: 'Informações do solicitante' })
  requestedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export class CheckAvailabilityDto {
  @ApiProperty({ description: 'ID da área comum' })
  @IsString()
  areaId: string;

  @ApiProperty({ description: 'Data/hora de início (ISO 8601)', example: '2024-12-15T14:00:00Z' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ description: 'Data/hora de término (ISO 8601)', example: '2024-12-15T22:00:00Z' })
  @IsDateString()
  endAt: string;
}
