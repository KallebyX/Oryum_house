import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsDateString, IsArray, IsObject, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AssemblyStatus } from '@prisma/client';

export class CreateAssemblyDto {
  @ApiProperty({ description: 'Título da assembleia', example: 'Assembleia Ordinária 2024' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ description: 'Agenda da assembleia (array de tópicos)' })
  @IsArray()
  agenda: string[];

  @ApiProperty({ description: 'Data/hora de início (ISO 8601)', example: '2024-12-20T19:00:00Z' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ description: 'Data/hora de término (ISO 8601)', example: '2024-12-20T22:00:00Z' })
  @IsDateString()
  endAt: string;

  @ApiProperty({ description: 'Quórum alvo (percentual)', example: 50 })
  @IsInt()
  @Min(1)
  quorumTarget: number;
}

export class UpdateAssemblyDto {
  @ApiPropertyOptional({ description: 'Título da assembleia' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Agenda da assembleia' })
  @IsArray()
  @IsOptional()
  agenda?: string[];

  @ApiPropertyOptional({ description: 'Data/hora de início (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  startAt?: string;

  @ApiPropertyOptional({ description: 'Data/hora de término (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endAt?: string;

  @ApiPropertyOptional({ description: 'Quórum alvo' })
  @IsInt()
  @Min(1)
  @IsOptional()
  quorumTarget?: number;
}

export class CreateAssemblyItemDto {
  @ApiProperty({ description: 'ID da assembleia' })
  @IsString()
  assemblyId: string;

  @ApiProperty({ description: 'Título do item de votação', example: 'Aprovar reforma da piscina' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada do item' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Ordem do item na pauta', example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({
    description: 'Opções de votação',
    example: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
      { id: 'abstencao', label: 'Abstenção' }
    ]
  })
  @IsArray()
  options: Array<{ id: string; label: string }>;
}

export class CastVoteDto {
  @ApiProperty({ description: 'ID do item de votação' })
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'ID da opção escolhida', example: 'sim' })
  @IsString()
  optionId: string;
}

export class QueryAssemblyDto {
  @ApiPropertyOptional({ description: 'Página', default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filtrar por status', enum: AssemblyStatus })
  @IsOptional()
  status?: AssemblyStatus;

  @ApiPropertyOptional({ description: 'Apenas futuras', type: Boolean })
  @Type(() => Boolean)
  @IsOptional()
  upcomingOnly?: boolean;
}
