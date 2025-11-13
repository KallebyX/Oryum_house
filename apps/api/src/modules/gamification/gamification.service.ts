import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WebSocketGateway } from '../../core/websocket/websocket.gateway';
import {
  AddPointsDto,
  CreateAchievementDto,
  UpdateAchievementDto,
  QueryRankingDto,
  AchievementCategory,
} from './dto/gamification.dto';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebSocketGateway,
  ) {}

  // ==========================================
  // PONTOS
  // ==========================================

  /**
   * Adicionar pontos para um usuário
   */
  async addPoints(condominiumId: string, data: AddPointsDto) {
    // Buscar ou criar registro de pontos do usuário
    let userPoints = await this.prisma.userPoints.findUnique({
      where: {
        userId_condominiumId: {
          userId: data.userId,
          condominiumId,
        },
      },
    });

    const oldLevel = userPoints?.level || 0;
    const newPoints = (userPoints?.points || 0) + data.points;
    const newLevel = this.calculateLevel(newPoints);
    const leveledUp = newLevel > oldLevel;

    if (userPoints) {
      userPoints = await this.prisma.userPoints.update({
        where: { id: userPoints.id },
        data: {
          points: newPoints,
          level: newLevel,
        },
      });
    } else {
      userPoints = await this.prisma.userPoints.create({
        data: {
          userId: data.userId,
          condominiumId,
          points: newPoints,
          level: newLevel,
        },
      });
    }

    // Registrar no histórico
    await this.prisma.pointHistory.create({
      data: {
        userId: data.userId,
        condominiumId,
        points: data.points,
        reason: data.reason,
        entityType: data.entityType,
        entityId: data.entityId,
      },
    });

    this.logger.log(
      `Pontos adicionados: ${data.points} para usuário ${data.userId} - Motivo: ${data.reason}`
    );

    // Enviar notificação de pontos ganhos
    this.websocketGateway.sendPointsEarned(data.userId, {
      points: data.points,
      totalPoints: newPoints,
      reason: data.reason,
      level: newLevel,
    });

    // Enviar notificação de level up se subiu de nível
    if (leveledUp) {
      this.websocketGateway.sendLevelUp(data.userId, {
        oldLevel,
        newLevel,
        totalPoints: newPoints,
      });
    }

    // Verificar se desbloqueou alguma conquista
    await this.checkAndUnlockAchievements(data.userId, condominiumId);

    return userPoints;
  }

  /**
   * Buscar pontos de um usuário
   */
  async getUserPoints(condominiumId: string, userId: string) {
    const userPoints = await this.prisma.userPoints.findUnique({
      where: {
        userId_condominiumId: {
          userId,
          condominiumId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!userPoints) {
      // Retornar estrutura padrão se não existir
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return {
        userId,
        condominiumId,
        points: 0,
        level: 1,
        user,
      };
    }

    return userPoints;
  }

  /**
   * Histórico de pontos de um usuário
   */
  async getPointHistory(condominiumId: string, userId: string) {
    const history = await this.prisma.pointHistory.findMany({
      where: {
        userId,
        condominiumId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return history;
  }

  // ==========================================
  // CONQUISTAS
  // ==========================================

  /**
   * Criar nova conquista
   */
  async createAchievement(condominiumId: string, data: CreateAchievementDto) {
    // Verificar se já existe
    const existing = await this.prisma.achievement.findUnique({
      where: { key: data.key },
    });

    if (existing) {
      throw new BadRequestException('Já existe uma conquista com esta chave');
    }

    const achievement = await this.prisma.achievement.create({
      data: {
        condominiumId,
        key: data.key,
        name: data.name,
        description: data.description,
        category: data.category,
        icon: data.icon,
        points: data.points,
        requirement: data.requirement,
      },
    });

    this.logger.log(`Conquista criada: ${achievement.key} - ${achievement.name}`);

    return achievement;
  }

  /**
   * Listar conquistas
   */
  async getAllAchievements(condominiumId: string) {
    const achievements = await this.prisma.achievement.findMany({
      where: {
        OR: [
          { condominiumId },
          { condominiumId: null }, // Conquistas globais
        ],
        isActive: true,
      },
      orderBy: {
        points: 'asc',
      },
    });

    return achievements;
  }

  /**
   * Atualizar conquista
   */
  async updateAchievement(achievementId: string, data: UpdateAchievementDto) {
    const achievement = await this.prisma.achievement.update({
      where: { id: achievementId },
      data,
    });

    return achievement;
  }

  /**
   * Conquistas desbloqueadas por um usuário
   */
  async getUserAchievements(userId: string) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    return userAchievements;
  }

  /**
   * Desbloquear conquista manualmente
   */
  async unlockAchievement(userId: string, achievementId: string) {
    // Verificar se já desbloqueou
    const existing = await this.prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Conquista já desbloqueada');
    }

    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException('Conquista não encontrada');
    }

    const userAchievement = await this.prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
      include: {
        achievement: true,
      },
    });

    this.logger.log(`Conquista desbloqueada: ${achievement.name} por usuário ${userId}`);

    // Enviar notificação em tempo real
    this.websocketGateway.sendAchievementUnlocked(userId, {
      achievementId: achievement.id,
      name: achievement.name,
      description: achievement.description,
      category: achievement.category,
      points: achievement.points,
      unlockedAt: userAchievement.unlockedAt,
    });

    // Adicionar pontos da conquista (isso pode desbloquear outras conquistas)
    if (achievement.condominiumId) {
      await this.addPoints(achievement.condominiumId, {
        userId,
        points: achievement.points,
        reason: `Conquista desbloqueada: ${achievement.name}`,
        entityType: 'ACHIEVEMENT',
        entityId: achievementId,
      });
    }

    return userAchievement;
  }

  // ==========================================
  // RANKING
  // ==========================================

  /**
   * Ranking de pontos do condomínio
   */
  async getRanking(condominiumId: string, query: QueryRankingDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [rankings, total] = await Promise.all([
      this.prisma.userPoints.findMany({
        where: { condominiumId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              user: {
                select: {
                  achievements: true,
                },
              },
            },
          },
        },
        orderBy: [
          { points: 'desc' },
          { level: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.userPoints.count({ where: { condominiumId } }),
    ]);

    // Adicionar posição no ranking
    const rankingsWithPosition = rankings.map((ranking, index) => ({
      ...ranking,
      position: skip + index + 1,
    }));

    return {
      items: rankingsWithPosition,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar posição de um usuário específico no ranking
   */
  async getUserRankingPosition(condominiumId: string, userId: string) {
    const allRankings = await this.prisma.userPoints.findMany({
      where: { condominiumId },
      orderBy: [
        { points: 'desc' },
        { level: 'desc' },
      ],
      select: {
        userId: true,
        points: true,
        level: true,
      },
    });

    const position = allRankings.findIndex(r => r.userId === userId) + 1;

    return {
      userId,
      position: position > 0 ? position : null,
      total: allRankings.length,
    };
  }

  /**
   * Estatísticas gerais de gamificação
   */
  async getStats(condominiumId: string) {
    const [totalPoints, totalUsers, totalAchievements, totalUnlocked] = await Promise.all([
      this.prisma.userPoints.aggregate({
        where: { condominiumId },
        _sum: { points: true },
      }),
      this.prisma.userPoints.count({ where: { condominiumId } }),
      this.prisma.achievement.count({
        where: {
          OR: [{ condominiumId }, { condominiumId: null }],
          isActive: true,
        },
      }),
      this.prisma.userAchievement.count({
        where: {
          user: {
            memberships: {
              some: { condominiumId, isActive: true },
            },
          },
        },
      }),
    ]);

    return {
      totalPoints: totalPoints._sum.points || 0,
      totalUsers,
      totalAchievements,
      totalUnlocked,
      averagePointsPerUser: totalUsers > 0 ? Math.round((totalPoints._sum.points || 0) / totalUsers) : 0,
    };
  }

  // ==========================================
  // UTILIDADES PRIVADAS
  // ==========================================

  /**
   * Calcular nível baseado em pontos
   */
  private calculateLevel(points: number): number {
    // Fórmula: nível = raiz quadrada(pontos / 100) + 1
    return Math.floor(Math.sqrt(points / 100)) + 1;
  }

  /**
   * Verificar e desbloquear conquistas automaticamente
   */
  private async checkAndUnlockAchievements(userId: string, condominiumId: string) {
    // Buscar conquistas do condomínio que o usuário ainda não desbloqueou
    const achievements = await this.prisma.achievement.findMany({
      where: {
        OR: [{ condominiumId }, { condominiumId: null }],
        isActive: true,
        userAchievements: {
          none: { userId },
        },
      },
    });

    for (const achievement of achievements) {
      const unlocked = await this.checkAchievementRequirement(
        userId,
        condominiumId,
        achievement.requirement as any
      );

      if (unlocked) {
        await this.unlockAchievement(userId, achievement.id);
      }
    }
  }

  /**
   * Verificar se usuário cumpre requisitos de uma conquista
   */
  private async checkAchievementRequirement(
    userId: string,
    condominiumId: string,
    requirement: any
  ): Promise<boolean> {
    // Implementar lógica de verificação baseada nos requisitos
    // Exemplo de requisitos:
    // { type: 'TICKET_COUNT', count: 1 } - Abrir 1 ticket
    // { type: 'NOTICE_READ', count: 5 } - Ler 5 comunicados
    // { type: 'POINTS', points: 100 } - Atingir 100 pontos

    if (requirement.type === 'POINTS') {
      const userPoints = await this.prisma.userPoints.findUnique({
        where: {
          userId_condominiumId: {
            userId,
            condominiumId,
          },
        },
      });
      return (userPoints?.points || 0) >= requirement.points;
    }

    if (requirement.type === 'TICKET_COUNT') {
      const count = await this.prisma.ticket.count({
        where: {
          condominiumId,
          openedById: userId,
        },
      });
      return count >= requirement.count;
    }

    if (requirement.type === 'NOTICE_READ') {
      const count = await this.prisma.noticeReadConfirmation.count({
        where: {
          userId,
          notice: { condominiumId },
        },
      });
      return count >= requirement.count;
    }

    return false;
  }
}
