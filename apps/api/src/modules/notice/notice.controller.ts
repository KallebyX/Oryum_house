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
import { NoticeService } from './notice.service';
import { CreateNoticeDto, UpdateNoticeDto, QueryNoticeDto, NoticeResponseDto } from './dto/notice.dto';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Roles } from '../../core/auth/decorators/roles.decorator';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import { RequireCondominium } from '../../core/auth/decorators/require-condominium.decorator';

@ApiTags('Comunicados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar novo comunicado' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Comunicado criado com sucesso', type: NoticeResponseDto })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar comunicados' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createNoticeDto: CreateNoticeDto,
  ) {
    return this.noticeService.create(condominiumId, userId, createNoticeDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar comunicados do condomínio' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista de comunicados retornada com sucesso' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Query() query: QueryNoticeDto,
  ) {
    return this.noticeService.findAll(condominiumId, userId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de comunicados' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.noticeService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar comunicado por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do comunicado' })
  @ApiResponse({ status: 200, description: 'Comunicado encontrado', type: NoticeResponseDto })
  @ApiResponse({ status: 404, description: 'Comunicado não encontrado' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.noticeService.findOne(condominiumId, id, userId);
  }

  @Patch(':id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Atualizar comunicado' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do comunicado' })
  @ApiResponse({ status: 200, description: 'Comunicado atualizado com sucesso', type: NoticeResponseDto })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar comunicados' })
  @ApiResponse({ status: 404, description: 'Comunicado não encontrado' })
  async update(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    return this.noticeService.update(condominiumId, id, userId, updateNoticeDto);
  }

  @Delete(':id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir comunicado' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do comunicado' })
  @ApiResponse({ status: 204, description: 'Comunicado excluído com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para excluir comunicados' })
  @ApiResponse({ status: 404, description: 'Comunicado não encontrado' })
  async remove(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.noticeService.remove(condominiumId, id, userId);
  }

  @Post(':id/read')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar leitura do comunicado' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do comunicado' })
  @ApiResponse({ status: 200, description: 'Leitura confirmada com sucesso' })
  @ApiResponse({ status: 404, description: 'Comunicado não encontrado' })
  async confirmRead(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.noticeService.confirmRead(condominiumId, id, userId);
  }

  @Get(':id/readers')
  @Roles('ADMIN_GLOBAL', 'SINDICO', 'ZELADOR')
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar usuários que leram o comunicado' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do comunicado' })
  @ApiResponse({ status: 200, description: 'Lista de leitores retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Comunicado não encontrado' })
  async getReaders(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.noticeService.getReaders(condominiumId, id, userId);
  }
}
