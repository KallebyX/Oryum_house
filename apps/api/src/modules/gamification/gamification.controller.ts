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
import { GamificationService } from './gamification.service';
import {
  AddPointsDto,
  CreateAchievementDto,
  UpdateAchievementDto,
  QueryRankingDto,
} from './dto/gamification.dto';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Roles } from '../../core/auth/decorators/roles.decorator';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import { RequireCondominium } from '../../core/auth/decorators/require-condominium.decorator';

@ApiTags('Gamificação')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums/:condominiumId/gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  // ==========================================
  // PONTOS
  // ==========================================

  @Post('points')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Adicionar pontos para um usuário' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Pontos adicionados com sucesso' })
  async addPoints(
    @Param('condominiumId') condominiumId: string,
    @Body() addPointsDto: AddPointsDto,
  ) {
    return this.gamificationService.addPoints(condominiumId, addPointsDto);
  }

  @Get('points/me')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar meus pontos' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Pontos retornados com sucesso' })
  async getMyPoints(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.gamificationService.getUserPoints(condominiumId, userId);
  }

  @Get('points/:userId')
  @RequireCondominium()
  @ApiOperation({ summary: 'Buscar pontos de um usuário' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Pontos retornados com sucesso' })
  async getUserPoints(
    @Param('condominiumId') condominiumId: string,
    @Param('userId') userId: string,
  ) {
    return this.gamificationService.getUserPoints(condominiumId, userId);
  }

  @Get('points/:userId/history')
  @RequireCondominium()
  @ApiOperation({ summary: 'Histórico de pontos de um usuário' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  async getPointHistory(
    @Param('condominiumId') condominiumId: string,
    @Param('userId') userId: string,
  ) {
    return this.gamificationService.getPointHistory(condominiumId, userId);
  }

  // ==========================================
  // CONQUISTAS
  // ==========================================

  @Post('achievements')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Criar nova conquista' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 201, description: 'Conquista criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Conquista com esta chave já existe' })
  async createAchievement(
    @Param('condominiumId') condominiumId: string,
    @Body() createAchievementDto: CreateAchievementDto,
  ) {
    return this.gamificationService.createAchievement(condominiumId, createAchievementDto);
  }

  @Get('achievements')
  @RequireCondominium()
  @ApiOperation({ summary: 'Listar todas as conquistas disponíveis' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Lista de conquistas retornada com sucesso' })
  async getAllAchievements(@Param('condominiumId') condominiumId: string) {
    return this.gamificationService.getAllAchievements(condominiumId);
  }

  @Patch('achievements/:id')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Atualizar conquista' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'id', description: 'ID da conquista' })
  @ApiResponse({ status: 200, description: 'Conquista atualizada com sucesso' })
  async updateAchievement(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.gamificationService.updateAchievement(id, updateAchievementDto);
  }

  @Get('achievements/me')
  @RequireCondominium()
  @ApiOperation({ summary: 'Minhas conquistas desbloqueadas' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Conquistas retornadas com sucesso' })
  async getMyAchievements(@CurrentUser('sub') userId: string) {
    return this.gamificationService.getUserAchievements(userId);
  }

  @Get('achievements/user/:userId')
  @RequireCondominium()
  @ApiOperation({ summary: 'Conquistas desbloqueadas por um usuário' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Conquistas retornadas com sucesso' })
  async getUserAchievements(@Param('userId') userId: string) {
    return this.gamificationService.getUserAchievements(userId);
  }

  @Post('achievements/:achievementId/unlock/:userId')
  @Roles('ADMIN_GLOBAL', 'SINDICO')
  @RequireCondominium()
  @ApiOperation({ summary: 'Desbloquear conquista manualmente para um usuário' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'achievementId', description: 'ID da conquista' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Conquista desbloqueada com sucesso' })
  @ApiResponse({ status: 400, description: 'Conquista já desbloqueada' })
  async unlockAchievement(
    @Param('userId') userId: string,
    @Param('achievementId') achievementId: string,
  ) {
    return this.gamificationService.unlockAchievement(userId, achievementId);
  }

  // ==========================================
  // RANKING
  // ==========================================

  @Get('ranking')
  @RequireCondominium()
  @ApiOperation({ summary: 'Ranking geral de pontos do condomínio' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Ranking retornado com sucesso' })
  async getRanking(
    @Param('condominiumId') condominiumId: string,
    @Query() query: QueryRankingDto,
  ) {
    return this.gamificationService.getRanking(condominiumId, query);
  }

  @Get('ranking/me')
  @RequireCondominium()
  @ApiOperation({ summary: 'Minha posição no ranking' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Posição retornada com sucesso' })
  async getMyRankingPosition(
    @Param('condominiumId') condominiumId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.gamificationService.getUserRankingPosition(condominiumId, userId);
  }

  @Get('ranking/:userId')
  @RequireCondominium()
  @ApiOperation({ summary: 'Posição de um usuário no ranking' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Posição retornada com sucesso' })
  async getUserRankingPosition(
    @Param('condominiumId') condominiumId: string,
    @Param('userId') userId: string,
  ) {
    return this.gamificationService.getUserRankingPosition(condominiumId, userId);
  }

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  @Get('stats')
  @RequireCondominium()
  @ApiOperation({ summary: 'Estatísticas gerais de gamificação' })
  @ApiParam({ name: 'condominiumId', description: 'ID do condomínio' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  async getStats(@Param('condominiumId') condominiumId: string) {
    return this.gamificationService.getStats(condominiumId);
  }
}
