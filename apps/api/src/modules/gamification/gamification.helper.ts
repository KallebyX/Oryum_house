import { Injectable, Logger } from '@nestjs/common';
import { GamificationService } from './gamification.service';

/**
 * Helper para facilitar integração de gamificação em outros módulos
 *
 * USO:
 * 1. Inject GamificationHelper no módulo
 * 2. Chame os métodos quando ações ocorrerem
 */
@Injectable()
export class GamificationHelper {
  private readonly logger = new Logger(GamificationHelper.name);

  constructor(private gamificationService: GamificationService) {}

  /**
   * Recompensas de pontos por ação
   */
  private readonly POINTS = {
    TICKET_CREATE: 10,
    TICKET_COMPLETE: 20,
    NOTICE_READ: 5,
    BOOKING_CREATE: 5,
    ASSEMBLY_VOTE: 15,
    ASSEMBLY_ATTEND: 25,
    INCIDENT_REPORT: 10,
    DOCUMENT_UPLOAD: 10,
  };

  /**
   * Adicionar pontos ao criar ticket
   */
  async onTicketCreated(condominiumId: string, userId: string, ticketId: string) {
    try {
      await this.gamificationService.addPoints(condominiumId, {
        userId,
        points: this.POINTS.TICKET_CREATE,
        reason: 'Criou um novo chamado',
        entityType: 'TICKET',
        entityId: ticketId,
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar pontos (ticket criado): ${error.message}`);
    }
  }

  /**
   * Adicionar pontos ao completar ticket
   */
  async onTicketCompleted(condominiumId: string, userId: string, ticketId: string) {
    try {
      await this.gamificationService.addPoints(condominiumId, {
        userId,
        points: this.POINTS.TICKET_COMPLETE,
        reason: 'Resolveu um chamado',
        entityType: 'TICKET',
        entityId: ticketId,
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar pontos (ticket completado): ${error.message}`);
    }
  }

  /**
   * Adicionar pontos ao ler comunicado
   */
  async onNoticeRead(condominiumId: string, userId: string, noticeId: string) {
    try {
      await this.gamificationService.addPoints(condominiumId, {
        userId,
        points: this.POINTS.NOTICE_READ,
        reason: 'Leu um comunicado',
        entityType: 'NOTICE',
        entityId: noticeId,
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar pontos (comunicado lido): ${error.message}`);
    }
  }

  /**
   * Adicionar pontos ao fazer reserva
   */
  async onBookingCreated(condominiumId: string, userId: string, bookingId: string) {
    try {
      await this.gamificationService.addPoints(condominiumId, {
        userId,
        points: this.POINTS.BOOKING_CREATE,
        reason: 'Fez uma reserva',
        entityType: 'BOOKING',
        entityId: bookingId,
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar pontos (reserva criada): ${error.message}`);
    }
  }

  /**
   * Adicionar pontos ao votar em assembleia
   */
  async onAssemblyVote(condominiumId: string, userId: string, assemblyId: string, itemId: string) {
    try {
      await this.gamificationService.addPoints(condominiumId, {
        userId,
        points: this.POINTS.ASSEMBLY_VOTE,
        reason: 'Votou em item de assembleia',
        entityType: 'ASSEMBLY',
        entityId: assemblyId,
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar pontos (voto em assembleia): ${error.message}`);
    }
  }

  /**
   * Adicionar pontos ao reportar incidente
   */
  async onIncidentReported(condominiumId: string, userId: string, incidentId: string) {
    try {
      await this.gamificationService.addPoints(condominiumId, {
        userId,
        points: this.POINTS.INCIDENT_REPORT,
        reason: 'Reportou uma ocorrência',
        entityType: 'INCIDENT',
        entityId: incidentId,
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar pontos (incidente reportado): ${error.message}`);
    }
  }

  /**
   * Adicionar pontos ao fazer upload de documento
   */
  async onDocumentUploaded(condominiumId: string, userId: string, documentId: string) {
    try {
      await this.gamificationService.addPoints(condominiumId, {
        userId,
        points: this.POINTS.DOCUMENT_UPLOAD,
        reason: 'Fez upload de documento',
        entityType: 'DOCUMENT',
        entityId: documentId,
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar pontos (documento uploaded): ${error.message}`);
    }
  }

  /**
   * Verificar e desbloquear conquistas específicas
   */
  async checkFirstTicketAchievement(condominiumId: string, userId: string) {
    try {
      // Buscar conquista "Primeiro Ticket"
      const achievement = await this.gamificationService['prisma'].achievement.findFirst({
        where: {
          key: 'FIRST_TICKET',
          OR: [{ condominiumId }, { condominiumId: null }],
        },
      });

      if (achievement) {
        // Verificar se já desbloqueou
        const unlocked = await this.gamificationService['prisma'].userAchievement.findUnique({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
        });

        if (!unlocked) {
          await this.gamificationService.unlockAchievement(userId, achievement.id);
          this.logger.log(`Conquista "Primeiro Ticket" desbloqueada para usuário ${userId}`);
        }
      }
    } catch (error) {
      this.logger.error(`Erro ao verificar conquista Primeiro Ticket: ${error.message}`);
    }
  }

  /**
   * Verificar conquista "Leitor Assíduo" (10 comunicados lidos)
   */
  async checkReaderAchievement(condominiumId: string, userId: string) {
    try {
      const achievement = await this.gamificationService['prisma'].achievement.findFirst({
        where: {
          key: 'READER_10',
          OR: [{ condominiumId }, { condominiumId: null }],
        },
      });

      if (achievement) {
        const count = await this.gamificationService['prisma'].noticeReadConfirmation.count({
          where: {
            userId,
            notice: { condominiumId },
          },
        });

        if (count >= 10) {
          const unlocked = await this.gamificationService['prisma'].userAchievement.findUnique({
            where: {
              userId_achievementId: {
                userId,
                achievementId: achievement.id,
              },
            },
          });

          if (!unlocked) {
            await this.gamificationService.unlockAchievement(userId, achievement.id);
            this.logger.log(`Conquista "Leitor Assíduo" desbloqueada para usuário ${userId}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Erro ao verificar conquista Leitor Assíduo: ${error.message}`);
    }
  }

  /**
   * Verificar conquista "Participante Ativo" (votou em 5 assembleias)
   */
  async checkActiveParticipantAchievement(condominiumId: string, userId: string) {
    try {
      const achievement = await this.gamificationService['prisma'].achievement.findFirst({
        where: {
          key: 'VOTER_5',
          OR: [{ condominiumId }, { condominiumId: null }],
        },
      });

      if (achievement) {
        // Contar assembleias distintas em que votou
        const assemblies = await this.gamificationService['prisma'].vote.findMany({
          where: {
            userId,
            assembly: { condominiumId },
          },
          select: {
            assemblyId: true,
          },
          distinct: ['assemblyId'],
        });

        if (assemblies.length >= 5) {
          const unlocked = await this.gamificationService['prisma'].userAchievement.findUnique({
            where: {
              userId_achievementId: {
                userId,
                achievementId: achievement.id,
              },
            },
          });

          if (!unlocked) {
            await this.gamificationService.unlockAchievement(userId, achievement.id);
            this.logger.log(`Conquista "Participante Ativo" desbloqueada para usuário ${userId}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Erro ao verificar conquista Participante Ativo: ${error.message}`);
    }
  }
}
