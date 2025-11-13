import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Título do documento', example: 'Convenção do Condomínio 2024' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'URL do arquivo', example: 'https://storage.com/documents/convencao.pdf' })
  @IsString()
  fileUrl: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes', example: 1048576 })
  fileSize: number;

  @ApiProperty({ description: 'Tipo MIME do arquivo', example: 'application/pdf' })
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ description: 'Versão do documento', example: '2.0', default: '1.0' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ description: 'Visibilidade', enum: ['ALL', 'ROLE', 'UNIT'], default: 'ALL' })
  @IsString()
  @IsOptional()
  visibility?: string;

  @ApiPropertyOptional({ description: 'Filtro de visibilidade (roles ou unidades específicas)' })
  @IsObject()
  @IsOptional()
  visibilityFilter?: Record<string, any>;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'Título do documento' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Versão do documento' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ description: 'Visibilidade' })
  @IsString()
  @IsOptional()
  visibility?: string;

  @ApiPropertyOptional({ description: 'Filtro de visibilidade' })
  @IsObject()
  @IsOptional()
  visibilityFilter?: Record<string, any>;
}

export class QueryDocumentDto {
  @ApiPropertyOptional({ description: 'Página', default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Buscar por título' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por tipo MIME' })
  @IsString()
  @IsOptional()
  mimeType?: string;
}
