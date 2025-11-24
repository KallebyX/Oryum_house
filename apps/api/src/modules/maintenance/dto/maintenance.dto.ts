import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for creating a maintenance plan
 * Based on Prisma schema: title, description, schedule, tasks, responsibleId, isActive
 */
export class CreateMaintenancePlanDto {
  @ApiProperty({
    description: 'Título do plano de manutenção',
    example: 'Manutenção Preventiva de Elevadores',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada',
    example: 'Inspeção mensal dos elevadores conforme norma NBR...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Regra de recorrência (RRULE format)',
    example: 'FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15',
  })
  @IsString()
  @IsNotEmpty()
  schedule: string;

  @ApiProperty({
    description: 'Tarefas da manutenção (JSON object)',
    example: {
      type: 'PREVENTIVA',
      priority: 'ALTA',
      tasks: ['Inspeção visual', 'Lubrificação', 'Teste de funcionamento'],
      estimatedCost: 500,
    },
  })
  @IsNotEmpty()
  tasks: any;

  @ApiPropertyOptional({
    description: 'ID do usuário responsável',
    example: 'clxxx123456',
  })
  @IsOptional()
  @IsString()
  responsibleId?: string;

  @ApiPropertyOptional({
    description: 'Plano está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean = true;
}

/**
 * DTO for updating a maintenance plan
 */
export class UpdateMaintenancePlanDto extends PartialType(CreateMaintenancePlanDto) {}

/**
 * DTO for creating a maintenance execution
 * Based on Prisma schema: planId, notes, completed
 */
export class CreateMaintenanceExecutionDto {
  @ApiProperty({
    description: 'ID do plano de manutenção',
    example: 'clxxx123456',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiPropertyOptional({
    description: 'Observações da execução',
    example: 'Manutenção realizada conforme previsto',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Execução foi concluída',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  completed?: boolean = false;
}

/**
 * DTO for updating a maintenance execution
 */
export class UpdateMaintenanceExecutionDto extends PartialType(CreateMaintenanceExecutionDto) {}

/**
 * DTO for querying maintenance plans
 */
export class QueryMaintenancePlanDto {
  @ApiPropertyOptional({
    description: 'Busca por título',
    example: 'elevador',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status ativo',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

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
 * DTO for querying maintenance executions
 */
export class QueryMaintenanceExecutionDto {
  @ApiPropertyOptional({
    description: 'Filtrar por status de conclusão',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por data inicial (>=)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por data final (<=)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

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
 * DTO for maintenance statistics
 */
export class MaintenanceStatsDto {
  @ApiProperty({
    description: 'Total de planos ativos',
    example: 12,
  })
  totalActivePlans: number;

  @ApiProperty({
    description: 'Total de execuções',
    example: 45,
  })
  totalExecutions: number;

  @ApiProperty({
    description: 'Execuções concluídas',
    example: 38,
  })
  completedExecutions: number;

  @ApiProperty({
    description: 'Execuções pendentes',
    example: 7,
  })
  pendingExecutions: number;

  @ApiProperty({
    description: 'Execuções este mês',
    example: 8,
  })
  executionsThisMonth: number;
}
