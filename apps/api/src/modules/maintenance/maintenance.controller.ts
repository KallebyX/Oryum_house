import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import {
  CreateMaintenancePlanDto,
  UpdateMaintenancePlanDto,
  CreateMaintenanceExecutionDto,
  UpdateMaintenanceExecutionDto,
  QueryMaintenancePlanDto,
  QueryMaintenanceExecutionDto,
} from './dto/maintenance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  // ==================== MAINTENANCE PLANS ====================

  @Post('plans')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Create a maintenance plan (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 201, description: 'Maintenance plan created successfully' })
  @ApiResponse({ status: 404, description: 'Condominium or responsible user not found' })
  createPlan(
    @Param('condominiumId') condominiumId: string,
    @Body() createMaintenancePlanDto: CreateMaintenancePlanDto,
  ) {
    return this.maintenanceService.createPlan(condominiumId, createMaintenancePlanDto);
  }

  @Get('plans')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get all maintenance plans' })
  @ApiResponse({ status: 200, description: 'List of maintenance plans' })
  findAllPlans(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryMaintenancePlanDto,
  ) {
    return this.maintenanceService.findAllPlans(condominiumId, query);
  }

  @Get('plans/:id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get maintenance plan details' })
  @ApiResponse({ status: 200, description: 'Maintenance plan details' })
  @ApiResponse({ status: 404, description: 'Maintenance plan not found' })
  findOnePlan(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.maintenanceService.findOnePlan(condominiumId, id);
  }

  @Patch('plans/:id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Update maintenance plan (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 200, description: 'Maintenance plan updated successfully' })
  @ApiResponse({ status: 404, description: 'Maintenance plan not found' })
  updatePlan(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @Body() updateMaintenancePlanDto: UpdateMaintenancePlanDto,
  ) {
    return this.maintenanceService.updatePlan(condominiumId, id, updateMaintenancePlanDto);
  }

  @Delete('plans/:id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Delete maintenance plan (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 200, description: 'Maintenance plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Maintenance plan not found' })
  removePlan(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.maintenanceService.removePlan(condominiumId, id);
  }

  // ==================== MAINTENANCE EXECUTIONS ====================

  @Post('executions')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO, UserRole.ZELADOR)
  @RequireCondominium()
  @ApiOperation({ summary: 'Create a maintenance execution (ADMIN/SINDICO/FUNCIONARIO)' })
  @ApiResponse({ status: 201, description: 'Maintenance execution created successfully' })
  @ApiResponse({ status: 404, description: 'Maintenance plan not found' })
  @ApiResponse({ status: 400, description: 'Maintenance plan is not active' })
  createExecution(
    @Param('condominiumId') condominiumId: string,
    @Body() createMaintenanceExecutionDto: CreateMaintenanceExecutionDto,
  ) {
    return this.maintenanceService.createExecution(condominiumId, createMaintenanceExecutionDto);
  }

  @Get('executions')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get all maintenance executions' })
  @ApiResponse({ status: 200, description: 'List of maintenance executions' })
  findAllExecutions(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryMaintenanceExecutionDto,
  ) {
    return this.maintenanceService.findAllExecutions(condominiumId, query);
  }

  @Get('executions/:id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get maintenance execution details' })
  @ApiResponse({ status: 200, description: 'Maintenance execution details' })
  @ApiResponse({ status: 404, description: 'Maintenance execution not found' })
  findOneExecution(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.maintenanceService.findOneExecution(condominiumId, id);
  }

  @Patch('executions/:id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO, UserRole.ZELADOR)
  @RequireCondominium()
  @ApiOperation({ summary: 'Update maintenance execution (ADMIN/SINDICO/FUNCIONARIO)' })
  @ApiResponse({ status: 200, description: 'Maintenance execution updated successfully' })
  @ApiResponse({ status: 404, description: 'Maintenance execution not found' })
  updateExecution(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @Body() updateMaintenanceExecutionDto: UpdateMaintenanceExecutionDto,
  ) {
    return this.maintenanceService.updateExecution(condominiumId, id, updateMaintenanceExecutionDto);
  }

  @Delete('executions/:id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Delete maintenance execution (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 200, description: 'Maintenance execution deleted successfully' })
  @ApiResponse({ status: 404, description: 'Maintenance execution not found' })
  removeExecution(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.maintenanceService.removeExecution(condominiumId, id);
  }

  // ==================== STATISTICS ====================

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get maintenance statistics' })
  @ApiResponse({ status: 200, description: 'Maintenance statistics' })
  @ApiResponse({ status: 404, description: 'Condominium not found' })
  getStats(@Param('condominiumId') condominiumId: string) {
    return this.maintenanceService.getStats(condominiumId);
  }
}
