import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum, IsObject, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum NoticeAudience {
  ALL = 'ALL',
  BLOCK = 'BLOCK',
  UNIT = 'UNIT',
}

export class CreateNoticeDto {
  @ApiProperty({ description: 'Título do comunicado', example: 'Manutenção programada do elevador' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Conteúdo do comunicado', example: 'Informamos que no dia 15/12 será realizada manutenção...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ description: 'Audiência do comunicado', enum: NoticeAudience, default: NoticeAudience.ALL })
  @IsEnum(NoticeAudience)
  @IsOptional()
  audience?: NoticeAudience;

  @ApiPropertyOptional({ description: 'Filtro de audiência (blocos ou unidades específicas)', example: { blocks: ['Bloco 1', 'Bloco 2'] } })
  @IsObject()
  @IsOptional()
  audienceFilter?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Fixar comunicado no topo', default: false })
  @IsBoolean()
  @IsOptional()
  pinned?: boolean;

  @ApiPropertyOptional({ description: 'Data de publicação (ISO 8601)', example: '2024-12-01T09:00:00Z' })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @ApiPropertyOptional({ description: 'Data de expiração (ISO 8601)', example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class UpdateNoticeDto {
  @ApiPropertyOptional({ description: 'Título do comunicado' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Conteúdo do comunicado' })
  @IsString()
  @MinLength(10)
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Audiência do comunicado', enum: NoticeAudience })
  @IsEnum(NoticeAudience)
  @IsOptional()
  audience?: NoticeAudience;

  @ApiPropertyOptional({ description: 'Filtro de audiência' })
  @IsObject()
  @IsOptional()
  audienceFilter?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Fixar comunicado no topo' })
  @IsBoolean()
  @IsOptional()
  pinned?: boolean;

  @ApiPropertyOptional({ description: 'Data de publicação (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @ApiPropertyOptional({ description: 'Data de expiração (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class QueryNoticeDto {
  @ApiPropertyOptional({ description: 'Página', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Buscar por título ou conteúdo' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar apenas fixados', type: Boolean })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  pinnedOnly?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar apenas publicados', type: Boolean })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  publishedOnly?: boolean;

  @ApiPropertyOptional({ description: 'Incluir expirados', type: Boolean, default: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  includeExpired?: boolean;
}

export class ConfirmReadNoticeDto {
  @ApiProperty({ description: 'ID do comunicado' })
  @IsString()
  noticeId: string;
}

export class NoticeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  condominiumId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  audience: string;

  @ApiProperty({ required: false })
  audienceFilter?: any;

  @ApiProperty()
  pinned: boolean;

  @ApiProperty({ required: false })
  publishedAt?: Date;

  @ApiProperty({ required: false })
  expiresAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: 'Número de confirmações de leitura' })
  readCount?: number;

  @ApiProperty({ description: 'Usuário atual confirmou leitura' })
  hasRead?: boolean;
}
