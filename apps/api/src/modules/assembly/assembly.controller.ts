import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AssemblyService } from './assembly.service';
import {
  CreateAssemblyDto,
  UpdateAssemblyDto,
  CreateAssemblyItemDto,
  CastVoteDto,
  QueryAssemblyDto,
} from './dto/assembly.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';

@ApiTags('Assembleias e Votações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/assemblies')
export class AssemblyController {
  constructor(private readonly assemblyService: AssemblyService) {}

  // ==========================================
  // ASSEMBLEIAS
  // ==========================================

  @Post()
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar nova assembleia' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Assembleia criada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar assembleias' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createAssemblyDto: CreateAssemblyDto,
  ) {
    return this.assemblyService.create(condominiumId, userId, createAssemblyDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar assembleias' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista de assembleias retornada' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryAssemblyDto,
  ) {
    return this.assemblyService.findAll(condominiumId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de assembleias' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.assemblyService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar assembleia por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da assembleia' })
  @ApiResponse({ status: 200, description: 'Assembleia encontrada' })
  @ApiResponse({ status: 404, description: 'Assembleia não encontrada' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.assemblyService.findOne(condominiumId, id);
  }

  @Patch(':id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Atualizar assembleia' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da assembleia' })
  @ApiResponse({ status: 200, description: 'Assembleia atualizada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar assembleias' })
  @ApiResponse({ status: 404, description: 'Assembleia não encontrada' })
  async update(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateAssemblyDto: UpdateAssemblyDto,
  ) {
    return this.assemblyService.update(condominiumId, id, userId, updateAssemblyDto);
  }

  @Post(':id/start')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar assembleia' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da assembleia' })
  @ApiResponse({ status: 200, description: 'Assembleia iniciada' })
  @ApiResponse({ status: 400, description: 'Assembleia não está agendada' })
  async start(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.assemblyService.start(condominiumId, id, userId);
  }

  @Post(':id/complete')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finalizar assembleia' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da assembleia' })
  @ApiResponse({ status: 200, description: 'Assembleia finalizada' })
  @ApiResponse({ status: 400, description: 'Assembleia não está em andamento' })
  async complete(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.assemblyService.complete(condominiumId, id, userId);
  }

  // ==========================================
  // ITENS DE VOTAÇÃO
  // ==========================================

  @Post('items')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar item de votação' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Item criado com sucesso' })
  async createItem(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createItemDto: CreateAssemblyItemDto,
  ) {
    return this.assemblyService.createItem(condominiumId, userId, createItemDto);
  }

  // ==========================================
  // VOTAÇÃO
  // ==========================================

  @Post(':id/vote')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar voto em item de assembleia' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da assembleia' })
  @ApiResponse({ status: 200, description: 'Voto registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Assembleia não está em andamento ou opção inválida' })
  async vote(
    @Param('condominiumId') condominiumId: string,
    @Param('id') assemblyId: string,
    @CurrentUser('sub') userId: string,
    @Body() voteDto: CastVoteDto,
  ) {
    return this.assemblyService.vote(condominiumId, assemblyId, userId, voteDto);
  }

  @Get(':assemblyId/items/:itemId/results')
  @RequireCondominium()
  @ApiOperation({ summary: 'Resultados de votação de um item' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'assemblyId', description: 'ID da assembleia' })
  @ApiParam({ name: 'itemId', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Resultados retornados' })
  async getItemResults(
    @Param('condominiumId') condominiumId: string,
    @Param('assemblyId') assemblyId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.assemblyService.getItemResults(condominiumId, assemblyId, itemId);
  }
}
