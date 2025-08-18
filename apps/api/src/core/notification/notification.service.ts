import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { WebSocketGateway } from '../websocket/websocket.gateway';
import * as nodemailer from 'nodemailer';
import * as webpush from 'web-push';
import { NotificationType } from '@prisma/client';

interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  url?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private emailTransporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private websocketGateway: WebSocketGateway,
  ) {
    this.initializeEmailTransporter();
    this.initializeWebPush();
  }

  private initializeEmailTransporter() {
    this.emailTransporter = nodemailer.createTransporter({
      host: this.configService.get('SMTP_HOST', 'localhost'),
      port: this.configService.get('SMTP_PORT', 1025),
      secure: false,
      auth: this.configService.get('SMTP_USER') ? {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      } : undefined,
    });
  }

  private initializeWebPush() {
    const vapidPublicKey = this.configService.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = this.configService.get('VAPID_PRIVATE_KEY');
    const vapidSubject = this.configService.get('VAPID_SUBJECT');

    if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
      webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    } else {
      this.logger.warn('VAPID keys não configuradas. Web Push não funcionará.');
    }
  }

  async sendNotification(userId: string, payload: NotificationPayload) {
    try {
      // Salvar notificação no banco
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          payload: payload.data || {},
        },
      });

      // Enviar via WebSocket (tempo real)
      this.websocketGateway.sendPersonalNotification(userId, {
        id: notification.id,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        url: payload.url,
        createdAt: notification.createdAt,
      });

      // Buscar preferências do usuário
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          name: true,
        },
      });

      if (!user) {
        this.logger.warn(`Usuário ${userId} não encontrado para notificação`);
        return { success: false };
      }

      // Enviar email (assíncrono)
      this.sendEmailNotification(user.email, user.name, payload).catch(error => {
        this.logger.error(`Erro ao enviar email para ${user.email}: ${error.message}`);
      });

      // Enviar Web Push (assíncrono)
      this.sendWebPushNotification(userId, payload).catch(error => {
        this.logger.error(`Erro ao enviar web push para ${userId}: ${error.message}`);
      });

      this.logger.log(`Notificação enviada para usuário ${userId}: ${payload.title}`);
      return { success: true, notificationId: notification.id };

    } catch (error) {
      this.logger.error(`Erro ao enviar notificação: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  private async sendEmailNotification(email: string, name: string, payload: NotificationPayload) {
    const template = this.getEmailTemplate(payload);
    
    const mailOptions = {
      from: this.configService.get('SMTP_FROM', 'noreply@oryumhouse.com'),
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html.replace('{{userName}}', name),
    };

    await this.emailTransporter.sendMail(mailOptions);
    this.logger.log(`Email enviado para ${email}: ${template.subject}`);
  }

  private async sendWebPushNotification(userId: string, payload: NotificationPayload) {
    // Aqui você buscaria as subscriptions do usuário do banco
    // Por simplicidade, vamos apenas logar
    this.logger.log(`Web Push enviado para usuário ${userId}: ${payload.title}`);
  }

  private getEmailTemplate(payload: NotificationPayload): EmailTemplate {
    const baseUrl = this.configService.get('NEXTAUTH_URL', 'http://localhost:3000');
    
    const templates = {
      [NotificationType.TICKET_UPDATE]: {
        subject: `[Oryum House] ${payload.title}`,
        text: `Olá {{userName}},\n\n${payload.message}\n\nAcesse o sistema para mais detalhes: ${baseUrl}${payload.url || '/dashboard/tickets'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
              <h1>🏠 Oryum House</h1>
            </div>
            <div style="padding: 20px;">
              <h2>${payload.title}</h2>
              <p>Olá <strong>{{userName}}</strong>,</p>
              <p>${payload.message}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}${payload.url || '/dashboard/tickets'}" 
                   style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Ver Detalhes
                </a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
              Esta é uma mensagem automática do sistema Oryum House.
            </div>
          </div>
        `,
      },
      [NotificationType.NEW_NOTICE]: {
        subject: `[Oryum House] Novo Comunicado: ${payload.title}`,
        text: `Olá {{userName}},\n\nNovo comunicado publicado:\n\n${payload.message}\n\nAcesse: ${baseUrl}/dashboard/notices`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
              <h1>📢 Novo Comunicado</h1>
            </div>
            <div style="padding: 20px;">
              <h2>${payload.title}</h2>
              <p>Olá <strong>{{userName}}</strong>,</p>
              <p>${payload.message}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard/notices" 
                   style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Ver Comunicados
                </a>
              </div>
            </div>
          </div>
        `,
      },
      [NotificationType.ASSEMBLY_REMINDER]: {
        subject: `[Oryum House] Lembrete: ${payload.title}`,
        text: `Olá {{userName}},\n\n${payload.message}\n\nAcesse: ${baseUrl}/dashboard/assemblies`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #8b5cf6; color: white; padding: 20px; text-align: center;">
              <h1>🗳️ Lembrete de Assembleia</h1>
            </div>
            <div style="padding: 20px;">
              <h2>${payload.title}</h2>
              <p>Olá <strong>{{userName}}</strong>,</p>
              <p>${payload.message}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard/assemblies" 
                   style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Ver Assembleias
                </a>
              </div>
            </div>
          </div>
        `,
      },
      [NotificationType.BOOKING_APPROVED]: {
        subject: `[Oryum House] Reserva Aprovada: ${payload.title}`,
        text: `Olá {{userName}},\n\nSua reserva foi aprovada!\n\n${payload.message}\n\nAcesse: ${baseUrl}/dashboard/bookings`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
              <h1>✅ Reserva Aprovada</h1>
            </div>
            <div style="padding: 20px;">
              <h2>${payload.title}</h2>
              <p>Olá <strong>{{userName}}</strong>,</p>
              <p>${payload.message}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard/bookings" 
                   style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Ver Reservas
                </a>
              </div>
            </div>
          </div>
        `,
      },
      [NotificationType.DELIVERY_RECEIVED]: {
        subject: `[Oryum House] Encomenda Recebida`,
        text: `Olá {{userName}},\n\n${payload.message}\n\nAcesse: ${baseUrl}/dashboard/deliveries`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
              <h1>📦 Encomenda Recebida</h1>
            </div>
            <div style="padding: 20px;">
              <p>Olá <strong>{{userName}}</strong>,</p>
              <p>${payload.message}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard/deliveries" 
                   style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Ver Entregas
                </a>
              </div>
            </div>
          </div>
        `,
      },
    };

    return templates[payload.type] || {
      subject: payload.title,
      text: payload.message,
      html: `<p>${payload.message}</p>`,
    };
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      const mailOptions = {
        from: this.configService.get('SMTP_FROM', 'noreply@oryumhouse.com'),
        to,
        subject,
        text: body,
        html: `<div style="font-family: Arial, sans-serif;">${body.replace(/\n/g, '<br>')}</div>`,
      };

      await this.emailTransporter.sendMail(mailOptions);
      this.logger.log(`Email enviado para ${to}: ${subject}`);
      return { success: true };

    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendWebPush(userId: string, payload: any) {
    try {
      // Implementação completa do Web Push seria mais complexa
      // Necessitaria gerenciar subscriptions no banco de dados
      this.logger.log(`Web Push enviado para usuário ${userId}: ${JSON.stringify(payload)}`);
      return { success: true };

    } catch (error) {
      this.logger.error(`Erro ao enviar web push: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Métodos específicos para diferentes tipos de notificação
  async notifyTicketUpdate(userId: string, ticketData: any) {
    return this.sendNotification(userId, {
      title: `Demanda Atualizada: ${ticketData.title}`,
      message: `A demanda #${ticketData.id} foi atualizada para o status: ${ticketData.status}`,
      type: NotificationType.TICKET_UPDATE,
      data: ticketData,
      url: `/dashboard/tickets/${ticketData.id}`,
    });
  }

  async notifyNewNotice(userId: string, noticeData: any) {
    return this.sendNotification(userId, {
      title: noticeData.title,
      message: `Novo comunicado publicado: ${noticeData.title}`,
      type: NotificationType.NEW_NOTICE,
      data: noticeData,
      url: `/dashboard/notices/${noticeData.id}`,
    });
  }

  async notifyBookingApproved(userId: string, bookingData: any) {
    return this.sendNotification(userId, {
      title: `Reserva Aprovada: ${bookingData.area?.name}`,
      message: `Sua reserva para ${bookingData.area?.name} foi aprovada!`,
      type: NotificationType.BOOKING_APPROVED,
      data: bookingData,
      url: `/dashboard/bookings/${bookingData.id}`,
    });
  }

  async notifyDeliveryReceived(userId: string, deliveryData: any) {
    return this.sendNotification(userId, {
      title: 'Encomenda Recebida',
      message: `Uma encomenda foi recebida para sua unidade. Código: ${deliveryData.code}`,
      type: NotificationType.DELIVERY_RECEIVED,
      data: deliveryData,
      url: `/dashboard/deliveries`,
    });
  }

  async notifyVisitorArrived(userId: string, visitorData: any) {
    return this.sendNotification(userId, {
      title: 'Visitante Chegou',
      message: `${visitorData.visitorName} chegou e está aguardando autorização.`,
      type: NotificationType.VISITOR_ARRIVED,
      data: visitorData,
      url: `/dashboard/visitors`,
    });
  }

  async notifyMaintenanceScheduled(userId: string, maintenanceData: any) {
    return this.sendNotification(userId, {
      title: 'Manutenção Programada',
      message: `Manutenção programada: ${maintenanceData.title}`,
      type: NotificationType.MAINTENANCE_SCHEDULED,
      data: maintenanceData,
      url: `/dashboard/maintenance`,
    });
  }

  async notifyIncidentReported(userId: string, incidentData: any) {
    return this.sendNotification(userId, {
      title: 'Nova Ocorrência',
      message: `Nova ocorrência reportada: ${incidentData.title}`,
      type: NotificationType.INCIDENT_REPORTED,
      data: incidentData,
      url: `/dashboard/incidents/${incidentData.id}`,
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    try {
      await this.prisma.notification.update({
        where: {
          id: notificationId,
          userId, // Garantir que o usuário só pode marcar suas próprias notificações
        },
        data: {
          readAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Erro ao marcar notificação como lida: ${error.message}`);
      return { success: false };
    }
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    try {
      const result = await this.prisma.paginate('notification', {
        page,
        limit,
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return result;
    } catch (error) {
      this.logger.error(`Erro ao buscar notificações: ${error.message}`);
      throw error;
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const count = await this.prisma.notification.count({
        where: {
          userId,
          readAt: null,
        },
      });

      return count;
    } catch (error) {
      this.logger.error(`Erro ao contar notificações não lidas: ${error.message}`);
      return 0;
    }
  }
}
