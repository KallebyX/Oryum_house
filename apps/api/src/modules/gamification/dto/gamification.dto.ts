import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsEnum, IsObject, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum AchievementCategory {
  PARTICIPATION = 'PARTICIPATION',
  COMMUNITY = 'COMMUNITY',
  PUNCTUALITY = 'PUNCTUALITY',
  SUPPORT = 'SUPPORT',
  SPECIAL = 'SPECIAL',
}

export class AddPointsDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Pontos a adicionar', example: 10 })
  @IsInt()
  points: number;

  @ApiProperty({ description: 'Motivo da pontuação', example: 'Leitura de comunicado' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ description: 'Tipo de entidade relacionada', example: 'NOTICE' })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiPropertyOptional({ description: 'ID da entidade relacionada' })
  @IsString()
  @IsOptional()
  entityId?: string;
}

export class CreateAchievementDto {
  @ApiProperty({ description: 'Chave única da conquista', example: 'FIRST_TICKET' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Nome da conquista', example: 'Primeiro Chamado' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição', example: 'Abriu seu primeiro chamado' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Categoria', enum: AchievementCategory })
  @IsEnum(AchievementCategory)
  category: AchievementCategory;

  @ApiPropertyOptional({ description: 'Ícone (emoji ou URL)', example: '🎯' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'Pontos concedidos', example: 50 })
  @IsInt()
  @Min(0)
  points: number;

  @ApiProperty({ description: 'Requisitos para desbloquear' })
  @IsObject()
  requirement: Record<string, any>;
}

export class UpdateAchievementDto {
  @ApiPropertyOptional({ description: 'Nome da conquista' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Ícone' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: 'Pontos concedidos' })
  @IsInt()
  @Min(0)
  @IsOptional()
  points?: number;

  @ApiPropertyOptional({ description: 'Ativa' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class QueryRankingDto {
  @ApiPropertyOptional({ description: 'Página', default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}
