import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for creating a new unit
 */
export class CreateUnitDto {
  @ApiProperty({
    description: 'Bloco/Torre da unidade',
    example: 'A',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  block: string;

  @ApiProperty({
    description: 'Número da unidade',
    example: '101',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  number: string;

  @ApiPropertyOptional({
    description: 'Área da unidade em m²',
    example: 85.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  areaM2?: number;
}

/**
 * DTO for updating a unit
 */
export class UpdateUnitDto extends PartialType(CreateUnitDto) {}

/**
 * DTO for querying units with filters
 */
export class QueryUnitDto {
  @ApiPropertyOptional({
    description: 'Busca por número ou bloco',
    example: '101',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por bloco',
    example: 'A',
  })
  @IsOptional()
  @IsString()
  block?: string;

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
 * DTO for assigning owner to unit
 */
export class AssignOwnerDto {
  @ApiProperty({
    description: 'ID do usuário que será o proprietário',
    example: 'clxxx123456',
  })
  @IsString()
  @IsNotEmpty()
  ownerId: string;
}

/**
 * DTO for adding occupant to unit
 */
export class AddOccupantDto {
  @ApiProperty({
    description: 'ID do usuário que será ocupante',
    example: 'clxxx789012',
  })
  @IsString()
  @IsNotEmpty()
  occupantId: string;
}

/**
 * DTO for unit statistics
 */
export class UnitStatsDto {
  @ApiProperty({
    description: 'Total de tickets da unidade',
    example: 5,
  })
  totalTickets: number;

  @ApiProperty({
    description: 'Total de reservas da unidade',
    example: 8,
  })
  totalBookings: number;

  @ApiProperty({
    description: 'Total de entregas recebidas',
    example: 12,
  })
  totalDeliveries: number;

  @ApiProperty({
    description: 'Total de visitantes autorizados',
    example: 3,
  })
  totalVisitors: number;

  @ApiProperty({
    description: 'Total de ocupantes',
    example: 4,
  })
  totalOccupants: number;
}
