import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum, IsString } from 'class-validator';

/**
 * Base DTO for date range queries in reports
 */
export class ReportDateRangeDto {
  @ApiPropertyOptional({
    description: 'Data inicial do período (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final do período (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

/**
 * Enum for report grouping periods
 */
export enum ReportGroupBy {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * DTO for time-series reports
 */
export class TimeSeriesReportDto extends ReportDateRangeDto {
  @ApiPropertyOptional({
    description: 'Agrupar resultados por período',
    enum: ReportGroupBy,
    example: ReportGroupBy.MONTH,
  })
  @IsOptional()
  @IsEnum(ReportGroupBy)
  groupBy?: ReportGroupBy = ReportGroupBy.MONTH;
}

/**
 * DTO for ticket category filter
 */
export class TicketReportDto extends TimeSeriesReportDto {
  @ApiPropertyOptional({
    description: 'Filtrar por categoria de ticket',
    example: 'ELETRICA',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por prioridade',
    example: 'ALTA',
  })
  @IsOptional()
  @IsString()
  priority?: string;
}

/**
 * Response DTO for overview dashboard
 */
export class OverviewReportDto {
  @ApiProperty({
    description: 'Total de unidades',
    example: 120,
  })
  totalUnits: number;

  @ApiProperty({
    description: 'Total de moradores ativos',
    example: 350,
  })
  totalResidents: number;

  @ApiProperty({
    description: 'Tickets abertos',
    example: 15,
  })
  openTickets: number;

  @ApiProperty({
    description: 'Tickets resolvidos este mês',
    example: 42,
  })
  ticketsResolvedThisMonth: number;

  @ApiProperty({
    description: 'Reservas pendentes',
    example: 8,
  })
  pendingBookings: number;

  @ApiProperty({
    description: 'Entregas pendentes',
    example: 12,
  })
  pendingDeliveries: number;

  @ApiProperty({
    description: 'Planos de manutenção ativos',
    example: 5,
  })
  activeMaintenancePlans: number;

  @ApiProperty({
    description: 'Incidentes em aberto',
    example: 3,
  })
  openIncidents: number;

  @ApiProperty({
    description: 'Taxa de satisfação média (0-5)',
    example: 4.2,
  })
  averageSatisfactionScore: number;
}

/**
 * Response DTO for ticket statistics
 */
export class TicketStatsReportDto {
  @ApiProperty({
    description: 'Total de tickets',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Tickets por status',
    example: {
      NOVA: 10,
      EM_ANDAMENTO: 25,
      CONCLUIDA: 100,
      CANCELADA: 15,
    },
  })
  byStatus: Record<string, number>;

  @ApiProperty({
    description: 'Tickets por prioridade',
    example: {
      BAIXA: 40,
      MEDIA: 80,
      ALTA: 30,
    },
  })
  byPriority: Record<string, number>;

  @ApiProperty({
    description: 'Tickets por categoria',
    example: {
      ELETRICA: 30,
      HIDRAULICA: 45,
      LIMPEZA: 25,
      SEGURANCA: 20,
      OUTROS: 30,
    },
  })
  byCategory: Record<string, number>;

  @ApiProperty({
    description: 'Tempo médio de resolução em horas',
    example: 18.5,
  })
  averageResolutionTimeHours: number;

  @ApiProperty({
    description: 'Taxa de satisfação média',
    example: 4.3,
  })
  averageSatisfactionScore: number;

  @ApiProperty({
    description: 'Tickets dentro do SLA (%)',
    example: 85.5,
  })
  slaComplianceRate: number;
}

/**
 * Response DTO for booking statistics
 */
export class BookingStatsReportDto {
  @ApiProperty({
    description: 'Total de reservas',
    example: 200,
  })
  total: number;

  @ApiProperty({
    description: 'Reservas por status',
    example: {
      PENDING: 10,
      APPROVED: 150,
      REJECTED: 20,
      CANCELED: 20,
    },
  })
  byStatus: Record<string, number>;

  @ApiProperty({
    description: 'Áreas mais reservadas',
    example: [
      { areaName: 'Salão de Festas', count: 80 },
      { areaName: 'Churrasqueira', count: 60 },
      { areaName: 'Piscina', count: 40 },
    ],
  })
  topAreas: Array<{ areaName: string; count: number }>;

  @ApiProperty({
    description: 'Taxa de aprovação (%)',
    example: 88.2,
  })
  approvalRate: number;

  @ApiProperty({
    description: 'Tempo médio de aprovação em horas',
    example: 4.5,
  })
  averageApprovalTimeHours: number;
}

/**
 * Response DTO for maintenance statistics
 */
export class MaintenanceStatsReportDto {
  @ApiProperty({
    description: 'Total de planos de manutenção',
    example: 12,
  })
  totalPlans: number;

  @ApiProperty({
    description: 'Planos ativos',
    example: 10,
  })
  activePlans: number;

  @ApiProperty({
    description: 'Total de execuções',
    example: 150,
  })
  totalExecutions: number;

  @ApiProperty({
    description: 'Execuções concluídas',
    example: 140,
  })
  completedExecutions: number;

  @ApiProperty({
    description: 'Taxa de conclusão (%)',
    example: 93.3,
  })
  completionRate: number;

  @ApiProperty({
    description: 'Execuções este mês',
    example: 15,
  })
  executionsThisMonth: number;

  @ApiProperty({
    description: 'Execuções atrasadas',
    example: 2,
  })
  overdueExecutions: number;
}

/**
 * Response DTO for financial overview (placeholder)
 */
export class FinancialReportDto {
  @ApiProperty({
    description: 'Receitas totais (placeholder)',
    example: 50000,
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Despesas totais (placeholder)',
    example: 35000,
  })
  totalExpenses: number;

  @ApiProperty({
    description: 'Saldo (placeholder)',
    example: 15000,
  })
  balance: number;

  @ApiProperty({
    description: 'Mensagem de aviso',
    example: 'Financial module not implemented yet',
  })
  note: string;
}

/**
 * Response DTO for delivery statistics
 */
export class DeliveryStatsReportDto {
  @ApiProperty({
    description: 'Total de entregas',
    example: 500,
  })
  total: number;

  @ApiProperty({
    description: 'Entregas pendentes',
    example: 25,
  })
  pending: number;

  @ApiProperty({
    description: 'Entregas retiradas',
    example: 475,
  })
  pickedUp: number;

  @ApiProperty({
    description: 'Tempo médio até retirada (horas)',
    example: 12.5,
  })
  averagePickupTimeHours: number;

  @ApiProperty({
    description: 'Unidades com mais entregas',
    example: [
      { unitId: 'clxxx123', identifier: '101', count: 45 },
      { unitId: 'clxxx456', identifier: '202', count: 38 },
    ],
  })
  topUnits: Array<{ unitId: string; identifier: string; count: number }>;
}

/**
 * Response DTO for incident statistics
 */
export class IncidentStatsReportDto {
  @ApiProperty({
    description: 'Total de incidentes',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Incidentes por status',
    example: {
      OPEN: 5,
      IN_PROGRESS: 8,
      RESOLVED: 30,
      CLOSED: 7,
    },
  })
  byStatus: Record<string, number>;

  @ApiProperty({
    description: 'Incidentes por tipo',
    example: {
      SEGURANCA: 15,
      BARULHO: 20,
      VAZAMENTO: 8,
      MANUTENCAO: 5,
      OUTROS: 2,
    },
  })
  byType: Record<string, number>;

  @ApiProperty({
    description: 'Tempo médio de resolução (horas)',
    example: 24.5,
  })
  averageResolutionTimeHours: number;
}

/**
 * Response DTO for time series data
 */
export class TimeSeriesDataPointDto {
  @ApiProperty({
    description: 'Período (data)',
    example: '2024-01',
  })
  period: string;

  @ApiProperty({
    description: 'Valor',
    example: 42,
  })
  value: number;
}

/**
 * Response DTO for activity report
 */
export class ActivityReportDto {
  @ApiProperty({
    description: 'Série temporal de tickets criados',
    type: [TimeSeriesDataPointDto],
  })
  ticketsCreated: TimeSeriesDataPointDto[];

  @ApiProperty({
    description: 'Série temporal de tickets resolvidos',
    type: [TimeSeriesDataPointDto],
  })
  ticketsResolved: TimeSeriesDataPointDto[];

  @ApiProperty({
    description: 'Série temporal de reservas',
    type: [TimeSeriesDataPointDto],
  })
  bookings: TimeSeriesDataPointDto[];

  @ApiProperty({
    description: 'Série temporal de comunicados',
    type: [TimeSeriesDataPointDto],
  })
  notices: TimeSeriesDataPointDto[];
}

/**
 * Response DTO for user engagement report
 */
export class UserEngagementReportDto {
  @ApiProperty({
    description: 'Usuários ativos (com login nos últimos 30 dias)',
    example: 250,
  })
  activeUsers: number;

  @ApiProperty({
    description: 'Taxa de engajamento (%)',
    example: 71.4,
  })
  engagementRate: number;

  @ApiProperty({
    description: 'Taxa de leitura de comunicados (%)',
    example: 65.5,
  })
  noticeReadRate: number;

  @ApiProperty({
    description: 'Taxa de participação em assembleias (%)',
    example: 45.2,
  })
  assemblyParticipationRate: number;

  @ApiProperty({
    description: 'Top usuários por pontos',
    example: [
      { userId: 'clxxx123', name: 'João Silva', points: 1500, level: 5 },
      { userId: 'clxxx456', name: 'Maria Santos', points: 1200, level: 4 },
    ],
  })
  topUsersByPoints: Array<{
    userId: string;
    name: string;
    points: number;
    level: number;
  }>;
}
