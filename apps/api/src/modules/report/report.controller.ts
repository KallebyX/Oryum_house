import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportService } from './report.service';
import {
  ReportDateRangeDto,
  TimeSeriesReportDto,
  TicketReportDto,
  OverviewReportDto,
  TicketStatsReportDto,
  BookingStatsReportDto,
  MaintenanceStatsReportDto,
  FinancialReportDto,
  DeliveryStatsReportDto,
  IncidentStatsReportDto,
  ActivityReportDto,
  UserEngagementReportDto,
} from './dto/report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('overview')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get overview dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Overview statistics',
    type: OverviewReportDto,
  })
  @ApiResponse({ status: 404, description: 'Condominium not found' })
  getOverview(
    @Param('condominiumId') condominiumId: string,
  ): Promise<OverviewReportDto> {
    return this.reportService.getOverview(condominiumId);
  }

  @Get('tickets')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get ticket statistics report' })
  @ApiResponse({
    status: 200,
    description: 'Ticket statistics',
    type: TicketStatsReportDto,
  })
  getTicketStats(
    @Param('condominiumId') condominiumId: string,
    @Query() query: TicketReportDto,
  ): Promise<TicketStatsReportDto> {
    return this.reportService.getTicketStats(condominiumId, query);
  }

  @Get('bookings')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get booking statistics report' })
  @ApiResponse({
    status: 200,
    description: 'Booking statistics',
    type: BookingStatsReportDto,
  })
  getBookingStats(
    @Param('condominiumId') condominiumId: string,
    @Query() query: ReportDateRangeDto,
  ): Promise<BookingStatsReportDto> {
    return this.reportService.getBookingStats(condominiumId, query);
  }

  @Get('maintenance')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get maintenance statistics report' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance statistics',
    type: MaintenanceStatsReportDto,
  })
  getMaintenanceStats(
    @Param('condominiumId') condominiumId: string,
    @Query() query: ReportDateRangeDto,
  ): Promise<MaintenanceStatsReportDto> {
    return this.reportService.getMaintenanceStats(condominiumId, query);
  }

  @Get('financial')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({
    summary: 'Get financial report (ADMIN/SINDICO only, placeholder)',
  })
  @ApiResponse({
    status: 200,
    description: 'Financial report (placeholder)',
    type: FinancialReportDto,
  })
  @ApiResponse({ status: 404, description: 'Condominium not found' })
  getFinancialReport(
    @Param('condominiumId') condominiumId: string,
    @Query() query: ReportDateRangeDto,
  ): Promise<FinancialReportDto> {
    return this.reportService.getFinancialReport(condominiumId, query);
  }

  @Get('deliveries')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get delivery statistics report' })
  @ApiResponse({
    status: 200,
    description: 'Delivery statistics',
    type: DeliveryStatsReportDto,
  })
  getDeliveryStats(
    @Param('condominiumId') condominiumId: string,
    @Query() query: ReportDateRangeDto,
  ): Promise<DeliveryStatsReportDto> {
    return this.reportService.getDeliveryStats(condominiumId, query);
  }

  @Get('incidents')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get incident statistics report' })
  @ApiResponse({
    status: 200,
    description: 'Incident statistics',
    type: IncidentStatsReportDto,
  })
  getIncidentStats(
    @Param('condominiumId') condominiumId: string,
    @Query() query: ReportDateRangeDto,
  ): Promise<IncidentStatsReportDto> {
    return this.reportService.getIncidentStats(condominiumId, query);
  }

  @Get('activity')
  @RequireCondominium()
  @ApiOperation({
    summary: 'Get activity time series report (placeholder)',
  })
  @ApiResponse({
    status: 200,
    description: 'Activity time series data (placeholder)',
    type: ActivityReportDto,
  })
  getActivityReport(
    @Param('condominiumId') condominiumId: string,
    @Query() query: TimeSeriesReportDto,
  ): Promise<ActivityReportDto> {
    return this.reportService.getActivityReport(condominiumId, query);
  }

  @Get('engagement')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({
    summary: 'Get user engagement report (ADMIN/SINDICO only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User engagement statistics',
    type: UserEngagementReportDto,
  })
  getUserEngagement(
    @Param('condominiumId') condominiumId: string,
    @Query() query: ReportDateRangeDto,
  ): Promise<UserEngagementReportDto> {
    return this.reportService.getUserEngagement(condominiumId, query);
  }
}
