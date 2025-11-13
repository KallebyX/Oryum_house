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
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto, QueryDocumentDto } from './dto/document.dto';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Roles } from '../../core/auth/decorators/roles.decorator';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import { RequireCondominium } from '../../core/auth/decorators/require-condominium.decorator';

@ApiTags('Documentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar novo documento' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar documentos' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    return this.documentService.create(condominiumId, userId, createDocumentDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar documentos do condomínio' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista de documentos retornada com sucesso' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Query() query: QueryDocumentDto,
  ) {
    return this.documentService.findAll(condominiumId, userId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de documentos' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.documentService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar documento por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do documento' })
  @ApiResponse({ status: 200, description: 'Documento encontrado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para acessar este documento' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.documentService.findOne(condominiumId, id, userId);
  }

  @Patch(':id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Atualizar documento' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar documentos' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  async update(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(condominiumId, id, userId, updateDocumentDto);
  }

  @Delete(':id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir documento' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do documento' })
  @ApiResponse({ status: 204, description: 'Documento excluído com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para excluir documentos' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  async remove(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.documentService.remove(condominiumId, id, userId);
  }
}
