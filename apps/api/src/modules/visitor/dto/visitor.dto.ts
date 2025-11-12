import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVisitorPassDto {
  @ApiProperty({ description: 'ID da unidade' })
  @IsString()
  unitId: string;

  @ApiProperty({ description: 'Nome do visitante' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  visitorName: string;

  @ApiPropertyOptional({ description: 'Documento (CPF, RG)' })
  @IsString()
  @IsOptional()
  document?: string;

  @ApiProperty({ description: 'Válido a partir de (ISO 8601)', example: '2024-12-15T08:00:00Z' })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ description: 'Válido até (ISO 8601)', example: '2024-12-15T20:00:00Z' })
  @IsDateString()
  validTo: string;
}

export class ValidateVisitorPassDto {
  @ApiProperty({ description: 'Token QR Code do visitante' })
  @IsString()
  qrToken: string;
}

export class QueryVisitorPassDto {
  @ApiPropertyOptional({ description: 'Página', default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filtrar por unidade' })
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiPropertyOptional({ description: 'Apenas passes ativos (não usados)', type: Boolean })
  @Type(() => Boolean)
  @IsOptional()
  activeOnly?: boolean;
}
