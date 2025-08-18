import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  condominiumIds?: string[];
}

@WSGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/ws',
})
export class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private connectedUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway iniciado');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extrair token do handshake
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      // Verificar JWT
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Buscar memberships do usuário
      const memberships = await this.prisma.membership.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: {
          condominiumId: true,
        },
      });

      // Configurar socket
      client.userId = userId;
      client.condominiumIds = memberships.map(m => m.condominiumId);

      // Adicionar aos rooms dos condomínios
      client.condominiumIds.forEach(condominiumId => {
        client.join(`condominium:${condominiumId}`);
      });

      // Adicionar ao room pessoal
      client.join(`user:${userId}`);

      // Rastrear conexão
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId).add(client.id);

      this.logger.log(`Cliente conectado: ${client.id} (usuário: ${userId})`);
      
      // Enviar confirmação de conexão
      client.emit('connected', {
        userId,
        condominiumIds: client.condominiumIds,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      this.logger.error(`Erro na autenticação WebSocket: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(client.userId);
        }
      }
    }
    
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  @SubscribeMessage('join-ticket')
  handleJoinTicket(
    @MessageBody() data: { ticketId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.join(`ticket:${data.ticketId}`);
    this.logger.log(`Cliente ${client.id} entrou no ticket ${data.ticketId}`);
  }

  @SubscribeMessage('leave-ticket')
  handleLeaveTicket(
    @MessageBody() data: { ticketId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.leave(`ticket:${data.ticketId}`);
    this.logger.log(`Cliente ${client.id} saiu do ticket ${data.ticketId}`);
  }

  @SubscribeMessage('typing-ticket')
  handleTypingTicket(
    @MessageBody() data: { ticketId: string; isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.to(`ticket:${data.ticketId}`).emit('user-typing', {
      userId: client.userId,
      ticketId: data.ticketId,
      isTyping: data.isTyping,
    });
  }

  // Métodos para enviar notificações
  sendTicketUpdate(condominiumId: string, ticketData: any) {
    this.server.to(`condominium:${condominiumId}`).emit('ticket:updated', {
      type: 'ticket:updated',
      data: ticketData,
      timestamp: new Date().toISOString(),
    });
  }

  sendTicketComment(ticketId: string, commentData: any) {
    this.server.to(`ticket:${ticketId}`).emit('ticket:comment', {
      type: 'ticket:comment',
      data: commentData,
      timestamp: new Date().toISOString(),
    });
  }

  sendTicketStatusChange(condominiumId: string, ticketId: string, statusData: any) {
    this.server.to(`condominium:${condominiumId}`).emit('ticket:status-changed', {
      type: 'ticket:status-changed',
      ticketId,
      data: statusData,
      timestamp: new Date().toISOString(),
    });
  }

  sendNewNotice(condominiumId: string, noticeData: any) {
    this.server.to(`condominium:${condominiumId}`).emit('notice:new', {
      type: 'notice:new',
      data: noticeData,
      timestamp: new Date().toISOString(),
    });
  }

  sendBookingUpdate(condominiumId: string, bookingData: any) {
    this.server.to(`condominium:${condominiumId}`).emit('booking:updated', {
      type: 'booking:updated',
      data: bookingData,
      timestamp: new Date().toISOString(),
    });
  }

  sendAssemblyUpdate(condominiumId: string, assemblyData: any) {
    this.server.to(`condominium:${condominiumId}`).emit('assembly:updated', {
      type: 'assembly:updated',
      data: assemblyData,
      timestamp: new Date().toISOString(),
    });
  }

  sendDeliveryNotification(condominiumId: string, unitId: string, deliveryData: any) {
    // Enviar para o condomínio (portaria/administração)
    this.server.to(`condominium:${condominiumId}`).emit('delivery:new', {
      type: 'delivery:new',
      data: deliveryData,
      timestamp: new Date().toISOString(),
    });

    // Enviar para usuários específicos da unidade
    this.sendToUnitOwners(condominiumId, unitId, 'delivery:received', deliveryData);
  }

  sendVisitorNotification(condominiumId: string, unitId: string, visitorData: any) {
    this.sendToUnitOwners(condominiumId, unitId, 'visitor:arrived', visitorData);
  }

  sendMaintenanceAlert(condominiumId: string, maintenanceData: any) {
    this.server.to(`condominium:${condominiumId}`).emit('maintenance:scheduled', {
      type: 'maintenance:scheduled',
      data: maintenanceData,
      timestamp: new Date().toISOString(),
    });
  }

  sendIncidentAlert(condominiumId: string, incidentData: any) {
    this.server.to(`condominium:${condominiumId}`).emit('incident:reported', {
      type: 'incident:reported',
      data: incidentData,
      timestamp: new Date().toISOString(),
    });
  }

  sendPersonalNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:personal', {
      type: 'notification:personal',
      data: notification,
      timestamp: new Date().toISOString(),
    });
  }

  // Método auxiliar para enviar notificações para proprietários/ocupantes de uma unidade
  private async sendToUnitOwners(condominiumId: string, unitId: string, event: string, data: any) {
    try {
      const unit = await this.prisma.unit.findUnique({
        where: { id: unitId },
        include: {
          owner: true,
          occupants: true,
        },
      });

      if (unit) {
        const userIds = new Set<string>();
        
        if (unit.owner) {
          userIds.add(unit.owner.id);
        }
        
        unit.occupants.forEach(occupant => {
          userIds.add(occupant.id);
        });

        userIds.forEach(userId => {
          this.server.to(`user:${userId}`).emit(event, {
            type: event,
            data,
            timestamp: new Date().toISOString(),
          });
        });
      }
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação para unidade ${unitId}: ${error.message}`);
    }
  }

  // Método para obter estatísticas de conexões
  getConnectionStats() {
    return {
      totalConnections: this.server.engine.clientsCount,
      connectedUsers: this.connectedUsers.size,
      rooms: Object.keys(this.server.sockets.adapter.rooms).length,
    };
  }

  // Método para desconectar usuário específico
  disconnectUser(userId: string, reason?: string) {
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit('force-disconnect', { reason });
          socket.disconnect(true);
        }
      });
    }
  }

  // Método para broadcast global (apenas para admins)
  sendGlobalBroadcast(message: any) {
    this.server.emit('global:broadcast', {
      type: 'global:broadcast',
      data: message,
      timestamp: new Date().toISOString(),
    });
  }
}
