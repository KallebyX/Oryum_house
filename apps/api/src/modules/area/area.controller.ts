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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AreaService } from './area.service';
import { CreateAreaDto, UpdateAreaDto, QueryAreaDto, AreaResponseDto } from './dto/area.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';

@ApiTags('Áreas Comuns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar nova área comum' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Área comum criada com sucesso', type: AreaResponseDto })
  @ApiResponse({ status: 400, description: 'Já existe área com este nome' })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar áreas' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createAreaDto: CreateAreaDto,
  ) {
    return this.areaService.create(condominiumId, userId, createAreaDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar áreas comuns do condomínio' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista de áreas retornada com sucesso' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryAreaDto,
  ) {
    return this.areaService.findAll(condominiumId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de áreas comuns' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.areaService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar área comum por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da área' })
  @ApiResponse({ status: 200, description: 'Área encontrada', type: AreaResponseDto })
  @ApiResponse({ status: 404, description: 'Área não encontrada' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.areaService.findOne(condominiumId, id);
  }

  @Patch(':id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Atualizar área comum' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da área' })
  @ApiResponse({ status: 200, description: 'Área atualizada com sucesso', type: AreaResponseDto })
  @ApiResponse({ status: 400, description: 'Já existe área com este nome' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar áreas' })
  @ApiResponse({ status: 404, description: 'Área não encontrada' })
  async update(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    return this.areaService.update(condominiumId, id, userId, updateAreaDto);
  }

  @Delete(':id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir área comum' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da área' })
  @ApiResponse({ status: 204, description: 'Área excluída com sucesso' })
  @ApiResponse({ status: 400, description: 'Área possui reservas futuras' })
  @ApiResponse({ status: 403, description: 'Sem permissão para excluir áreas' })
  @ApiResponse({ status: 404, description: 'Área não encontrada' })
  async remove(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.areaService.remove(condominiumId, id, userId);
  }
}
