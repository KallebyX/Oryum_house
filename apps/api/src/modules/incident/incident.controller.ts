import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { IncidentService } from './incident.service';
import { CreateIncidentDto, UpdateIncidentDto, QueryIncidentDto } from './dto/incident.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';

@ApiTags('Incidentes/Ocorrências')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  @RequireCondominium()
  @ApiOperation({ summary: 'Registrar novo incidente' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Incidente registrado com sucesso' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createIncidentDto: CreateIncidentDto,
  ) {
    return this.incidentService.create(condominiumId, userId, createIncidentDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar incidentes' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryIncidentDto,
  ) {
    return this.incidentService.findAll(condominiumId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de incidentes' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.incidentService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar incidente por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do incidente' })
  @ApiResponse({ status: 200, description: 'Incidente encontrado' })
  @ApiResponse({ status: 404, description: 'Incidente não encontrado' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.incidentService.findOne(condominiumId, id);
  }

  @Patch(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Atualizar incidente' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do incidente' })
  @ApiResponse({ status: 200, description: 'Incidente atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Incidente não encontrado' })
  async update(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ) {
    return this.incidentService.update(condominiumId, id, userId, updateIncidentDto);
  }
}
