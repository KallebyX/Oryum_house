import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeliveryDto {
  @ApiProperty({ description: 'ID da unidade destinatária' })
  @IsString()
  unitId: string;

  @ApiPropertyOptional({ description: 'Transportadora/empresa' })
  @IsString()
  @IsOptional()
  carrier?: string;

  @ApiPropertyOptional({ description: 'Descrição da entrega' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class PickupDeliveryDto {
  @ApiProperty({ description: 'Código da entrega' })
  @IsString()
  @MinLength(4)
  code: string;
}

export class QueryDeliveryDto {
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

  @ApiPropertyOptional({ description: 'Apenas não retiradas', type: Boolean })
  @Type(() => Boolean)
  @IsOptional()
  pendingOnly?: boolean;
}
