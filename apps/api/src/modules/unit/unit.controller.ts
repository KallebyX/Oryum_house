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
import { UnitService } from './unit.service';
import {
  CreateUnitDto,
  UpdateUnitDto,
  QueryUnitDto,
  AssignOwnerDto,
  AddOccupantDto,
} from './dto/unit.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Create a new unit (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  @ApiResponse({ status: 409, description: 'Unit already exists' })
  create(
    @Param('condominiumId') condominiumId: string,
    @Body() createUnitDto: CreateUnitDto,
  ) {
    return this.unitService.create(condominiumId, createUnitDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Get all units in condominium' })
  @ApiResponse({ status: 200, description: 'List of units' })
  findAll(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryUnitDto,
  ) {
    return this.unitService.findAll(condominiumId, query);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get unit details' })
  @ApiResponse({ status: 200, description: 'Unit details' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.unitService.findOne(condominiumId, id);
  }

  @Get(':id/stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get unit statistics' })
  @ApiResponse({ status: 200, description: 'Unit statistics' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  getStats(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.unitService.getStats(condominiumId, id);
  }

  @Get(':id/occupants')
  @RequireCondominium()
  @ApiOperation({ summary: 'Get unit occupants' })
  @ApiResponse({ status: 200, description: 'List of occupants' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  getOccupants(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.unitService.getOccupants(condominiumId, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Update unit information (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  @ApiResponse({ status: 409, description: 'Unit identifier conflict' })
  update(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.update(condominiumId, id, updateUnitDto);
  }

  @Post(':id/owner')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Assign owner to unit (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 200, description: 'Owner assigned successfully' })
  @ApiResponse({ status: 404, description: 'Unit or user not found' })
  assignOwner(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @Body() assignOwnerDto: AssignOwnerDto,
  ) {
    return this.unitService.assignOwner(
      condominiumId,
      id,
      assignOwnerDto.ownerId,
    );
  }

  @Post(':id/occupants')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Add occupant to unit (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 201, description: 'Occupant added successfully' })
  @ApiResponse({ status: 404, description: 'Unit or user not found' })
  @ApiResponse({ status: 409, description: 'User is already an occupant' })
  addOccupant(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @Body() addOccupantDto: AddOccupantDto,
  ) {
    return this.unitService.addOccupant(
      condominiumId,
      id,
      addOccupantDto.occupantId,
    );
  }

  @Delete(':id/occupants/:occupantId')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Remove occupant from unit (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 200, description: 'Occupant removed successfully' })
  @ApiResponse({ status: 404, description: 'Unit or occupant not found' })
  removeOccupant(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @Param('occupantId') occupantId: string,
  ) {
    return this.unitService.removeOccupant(condominiumId, id, occupantId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @RequireCondominium()
  @ApiOperation({ summary: 'Delete a unit (ADMIN/SINDICO only)' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete unit with active relations' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  remove(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.unitService.remove(condominiumId, id);
  }
}
