import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { IncidentType, IncidentStatus } from '@prisma/client';

export class CreateIncidentDto {
  @ApiProperty({ description: 'Tipo de incidente', enum: IncidentType })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty({ description: 'Título do incidente' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Descrição detalhada' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ description: 'URLs de anexos (imagens, vídeos)', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class UpdateIncidentDto {
  @ApiPropertyOptional({ description: 'Status do incidente', enum: IncidentStatus })
  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;

  @ApiPropertyOptional({ description: 'Descrição adicional/atualização' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class QueryIncidentDto {
  @ApiPropertyOptional({ description: 'Página', default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filtrar por tipo', enum: IncidentType })
  @IsEnum(IncidentType)
  @IsOptional()
  type?: IncidentType;

  @ApiPropertyOptional({ description: 'Filtrar por status', enum: IncidentStatus })
  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;

  @ApiPropertyOptional({ description: 'Buscar por título ou descrição' })
  @IsString()
  @IsOptional()
  search?: string;
}
