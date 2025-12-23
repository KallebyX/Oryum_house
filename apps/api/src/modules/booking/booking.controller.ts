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
import { BookingService } from './booking.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  QueryBookingDto,
  ApproveRejectBookingDto,
  CheckAvailabilityDto,
  BookingResponseDto,
} from './dto/booking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireCondominium } from '../../common/decorators/condominium.decorator';

@ApiTags('Reservas de Áreas Comuns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar nova reserva' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso', type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou horário indisponível' })
  @ApiResponse({ status: 404, description: 'Área ou unidade não encontrada' })
  async create(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.create(condominiumId, userId, createBookingDto);
  }

  @Post('check-availability')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar disponibilidade de horário' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Disponibilidade verificada' })
  async checkAvailability(
    @Param('condominiumId') condominiumId: string,
    @Body() checkAvailabilityDto: CheckAvailabilityDto,
  ) {
    return this.bookingService.checkAvailability(condominiumId, checkAvailabilityDto);
  }

  @Get()
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar reservas' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista de reservas retornada com sucesso' })
  async findAll(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
    @Query() query: QueryBookingDto,
  ) {
    return this.bookingService.findAll(condominiumId, userId, query);
  }

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas de reservas' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.bookingService.getStats(condominiumId);
  }

  @Get(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada', type: BookingResponseDto })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
  ) {
    return this.bookingService.findOne(condominiumId, id);
  }

  @Patch(':id')
  @RequireCondominium()
  @ApiOperation({ summary: 'Atualizar reserva (apenas se PENDING)' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso', type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Apenas reservas pendentes podem ser editadas' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar esta reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async update(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(condominiumId, id, userId, updateBookingDto);
  }

  @Patch(':id/approve-reject')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Aprovar ou rejeitar reserva' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva aprovada/rejeitada com sucesso', type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Apenas reservas pendentes podem ser aprovadas/rejeitadas' })
  @ApiResponse({ status: 403, description: 'Apenas síndicos podem aprovar/rejeitar reservas' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async approveOrReject(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() approveRejectDto: ApproveRejectBookingDto,
  ) {
    return this.bookingService.approveOrReject(condominiumId, id, userId, approveRejectDto);
  }

  @Delete(':id')
  @RequireCondominium()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar reserva' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada com sucesso' })
  @ApiResponse({ status: 400, description: 'Reserva já está cancelada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para cancelar esta reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async cancel(
    @Param('condominiumId') condominiumId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingService.cancel(condominiumId, id, userId);
  }
}
