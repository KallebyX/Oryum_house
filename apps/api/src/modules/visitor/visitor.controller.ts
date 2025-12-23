import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import { CreateVisitorPassDto, QueryVisitorPassDto, ValidateVisitorPassDto } from './dto/visitor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';

@ApiTags('Visitantes (Portaria)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar passe de visitante' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Passe criado com sucesso' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createVisitorPassDto: CreateVisitorPassDto,
  ) {
    return this.visitorService.create(condominiumId, userId, createVisitorPassDto);
  }

  @Post('validate')
  @Roles('ADMIN_GLOBAL', 'SINDICO', 'PORTARIA', 'ZELADOR')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar passe de visitante (QR Code)' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Passe validado com sucesso' })
  @ApiResponse({ status: 400, description: 'Passe já usado ou expirado' })
  @ApiResponse({ status: 404, description: 'Passe inválido' })
  async validate(
    @Param('condominiumId') condominiumId: string,
    @Body() validateDto: ValidateVisitorPassDto,
  ) {
    return this.visitorService.validate(condominiumId, validateDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar passes de visitantes' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryVisitorPassDto,
  ) {
    return this.visitorService.findAll(condominiumId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de visitantes' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.visitorService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar passe por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID do passe' })
  @ApiResponse({ status: 200, description: 'Passe encontrado' })
  @ApiResponse({ status: 404, description: 'Passe não encontrado' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.visitorService.findOne(condominiumId, id);
  }
}
