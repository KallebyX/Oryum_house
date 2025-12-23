import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
  IsPostalCode,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for creating a new condominium
 */
export class CreateCondominiumDto {
  @ApiProperty({
    description: 'Nome do condomínio',
    example: 'Residencial Horizonte',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    description: 'CNPJ do condomínio',
    example: '12.345.678/0001-90',
  })
  @IsOptional()
  @IsString()
  @MaxLength(18)
  cnpj?: string;

  @ApiProperty({
    description: 'Rua/Logradouro',
    example: 'Rua das Flores',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  street: string;

  @ApiProperty({
    description: 'Número',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  number: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @Transform(({ value }) => value?.toUpperCase())
  state: string;

  @ApiProperty({
    description: 'CEP',
    example: '12345-678',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  cep: string;

  @ApiPropertyOptional({
    description: 'URL do logo do condomínio',
    example: 'https://storage.example.com/logos/condominium-123.png',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}

/**
 * DTO for updating a condominium
 */
export class UpdateCondominiumDto extends PartialType(CreateCondominiumDto) {}

/**
 * DTO for querying condominiums with filters and pagination
 */
export class QueryCondominiumDto {
  @ApiPropertyOptional({
    description: 'Busca por nome',
    example: 'Horizonte',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por cidade',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  @Transform(({ value }) => value?.toUpperCase())
  state?: string;

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
 * DTO for condominium statistics
 */
export class CondominiumStatsDto {
  @ApiProperty({
    description: 'Total de unidades',
    example: 50,
  })
  totalUnits: number;

  @ApiProperty({
    description: 'Total de moradores',
    example: 125,
  })
  totalResidents: number;

  @ApiProperty({
    description: 'Total de tickets abertos',
    example: 8,
  })
  openTickets: number;

  @ApiProperty({
    description: 'Total de reservas ativas',
    example: 3,
  })
  activeBookings: number;

  @ApiProperty({
    description: 'Total de comunicados ativos',
    example: 5,
  })
  activeNotices: number;

  @ApiProperty({
    description: 'Total de assembleias agendadas',
    example: 1,
  })
  scheduledAssemblies: number;

  @ApiProperty({
    description: 'Taxa de satisfação média (1-5)',
    example: 4.2,
  })
  averageSatisfaction: number;
}

/**
 * DTO for uploading condominium logo
 */
export class UploadLogoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Logo file (max 2MB, formats: jpg, png)',
  })
  file: any;
}
