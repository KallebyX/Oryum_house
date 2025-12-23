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
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, QueryDeliveryDto, PickupDeliveryDto } from './dto/delivery.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';

@ApiTags('Entregas (Portaria)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @Roles('ADMIN_GLOBAL', 'SINDICO', 'PORTARIA', 'ZELADOR')
  @RequireCondominium()
  @ApiOperation({ summary: 'Registrar nova entrega' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Entrega registrada com sucesso' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createDeliveryDto: CreateDeliveryDto,
  ) {
    return this.deliveryService.create(condominiumId, userId, createDeliveryDto);
  }

  @Post('pickup')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar retirada de entrega por código' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Retirada confirmada com sucesso' })
  @ApiResponse({ status: 400, description: 'Entrega já retirada' })
  @ApiResponse({ status: 404, description: 'Código inválido' })
  async pickup(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() pickupDto: PickupDeliveryDto,
  ) {
    return this.deliveryService.pickup(condominiumId, userId, pickupDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar entregas' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista de entregas retornada com sucesso' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryDeliveryDto,
  ) {
    return this.deliveryService.findAll(condominiumId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de entregas' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.deliveryService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar entrega por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da entrega' })
  @ApiResponse({ status: 200, description: 'Entrega encontrada' })
  @ApiResponse({ status: 404, description: 'Entrega não encontrada' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.deliveryService.findOne(condominiumId, id);
  }
}
