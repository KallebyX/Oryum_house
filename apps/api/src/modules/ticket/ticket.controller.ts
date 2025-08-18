import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query, 
  UseGuards, 
  ParseUUIDPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { 
  CreateTicketDto, 
  UpdateTicketDto, 
  AssignTicketDto, 
  UpdateTicketStatusDto, 
  CloseTicketDto, 
  TicketSatisfactionDto, 
  AddTicketCommentDto,
  TicketFiltersDto 
} from './dto/ticket.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('tickets')
@Controller('condominiums/:condominiumId/tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireCondominium()
@ApiBearerAuth()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova demanda' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ 
    status: 201, 
    description: 'Demanda criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        priority: { type: 'string' },
        category: { type: 'string' },
        createdAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  async create(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @CurrentUser() user: CurrentUserData,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.ticketService.create(user.id, condominiumId, createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar demandas com filtros e paginação' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filtrar por prioridade' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoria' })
  @ApiQuery({ name: 'q', required: false, description: 'Busca textual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de demandas paginada',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'string' },
              priority: { type: 'string' },
              category: { type: 'string' },
              openedBy: { type: 'object' },
              assignedTo: { type: 'object' },
              createdAt: { type: 'string' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @CurrentUser() user: CurrentUserData,
    @Query() filters: TicketFiltersDto,
  ) {
    return this.ticketService.findAll(condominiumId, filters, user.role as UserRole, user.id);
  }

  @Get('kanban')
  @ApiOperation({ summary: 'Obter view Kanban das demandas' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ 
    status: 200, 
    description: 'Demandas organizadas por status para view Kanban',
    schema: {
      type: 'object',
      properties: {
        NOVA: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            tickets: { type: 'array' },
          },
        },
        EM_AVALIACAO: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            tickets: { type: 'array' },
          },
        },
        // ... outros status
      },
    },
  })
  async getKanbanView(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.ticketService.getKanbanView(condominiumId, user.role as UserRole, user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas das demandas' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas das demandas',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        open: { type: 'number' },
        closed: { type: 'number' },
        overdue: { type: 'number' },
        avgSatisfaction: { type: 'number' },
        categoryStats: { type: 'array' },
        priorityStats: { type: 'array' },
      },
    },
  })
  async getStats(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.ticketService.getStats(condominiumId, user.role as UserRole, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma demanda' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalhes da demanda',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        statusHistory: { type: 'array' },
        comments: { type: 'array' },
        attachments: { type: 'array' },
        openedBy: { type: 'object' },
        assignedTo: { type: 'object' },
        unit: { type: 'object' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Demanda não encontrada' })
  async findOne(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.ticketService.findOne(id, condominiumId, user.role as UserRole, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar demanda' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ 
    status: 200, 
    description: 'Demanda atualizada com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar esta demanda' })
  @ApiResponse({ status: 404, description: 'Demanda não encontrada' })
  async update(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, condominiumId, updateTicketDto, user.id, user.role as UserRole);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO, UserRole.ZELADOR)
  @ApiOperation({ summary: 'Atribuir demanda a um responsável' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ 
    status: 200, 
    description: 'Demanda atribuída com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Sem permissão para atribuir demandas' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado ou sem acesso ao condomínio' })
  async assign(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() assignTicketDto: AssignTicketDto,
  ) {
    return this.ticketService.assign(id, condominiumId, assignTicketDto, user.id, user.role as UserRole);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da demanda' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status atualizado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 403, description: 'Sem permissão para alterar status' })
  async updateStatus(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateStatusDto: UpdateTicketStatusDto,
  ) {
    return this.ticketService.updateStatus(id, condominiumId, updateStatusDto, user.id, user.role as UserRole);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Fechar demanda' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ 
    status: 200, 
    description: 'Demanda fechada com sucesso',
  })
  async close(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() closeTicketDto: CloseTicketDto,
  ) {
    return this.ticketService.close(id, condominiumId, closeTicketDto, user.id, user.role as UserRole);
  }

  @Post(':id/satisfaction')
  @Roles(UserRole.MORADOR)
  @ApiOperation({ summary: 'Avaliar satisfação da demanda (apenas quem abriu)' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ 
    status: 200, 
    description: 'Avaliação registrada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Apenas demandas concluídas podem ser avaliadas' })
  @ApiResponse({ status: 403, description: 'Apenas quem abriu a demanda pode avaliá-la' })
  async addSatisfaction(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() satisfactionDto: TicketSatisfactionDto,
  ) {
    return this.ticketService.addSatisfaction(id, condominiumId, satisfactionDto, user.id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Adicionar comentário à demanda' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ 
    status: 201, 
    description: 'Comentário adicionado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        message: { type: 'string' },
        author: { type: 'object' },
        createdAt: { type: 'string' },
      },
    },
  })
  async addComment(
    @Param('condominiumId', ParseUUIDPipe) condominiumId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() commentDto: AddTicketCommentDto,
  ) {
    return this.ticketService.addComment(id, condominiumId, commentDto, user.id, user.role as UserRole);
  }
}
