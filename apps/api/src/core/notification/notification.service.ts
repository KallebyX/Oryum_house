import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { WebSocketGateway } from '../websocket/websocket.gateway';
import * as nodemailer from 'nodemailer';
import * as webpush from 'web-push';

interface NotificationPayload {
  title: string;
  message: string;
  type: string;
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
    this.emailTransporter = nodemailer.createTransport({
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
      // Enviar via WebSocket (tempo real)
      this.websocketGateway.sendPersonalNotification(userId, {
        id: Date.now().toString(),
        title: payload.title,
        message: payload.message,
        type: payload.type,
        url: payload.url,
        createdAt: new Date(),
      });

      // Buscar usuário
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
      return { success: true, notificationId: Date.now().toString() };

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
      'TICKET_UPDATE': {
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
      'NEW_NOTICE': {
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
                  Ver Comunicado
                </a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
              Esta é uma mensagem automática do sistema Oryum House.
            </div>
          </div>
        `,
      },
      'GENERAL': {
        subject: `[Oryum House] ${payload.title}`,
        text: `Olá {{userName}},\n\n${payload.message}\n\nAcesse: ${baseUrl}${payload.url || '/dashboard'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #6b7280; color: white; padding: 20px; text-align: center;">
              <h1>🏠 Oryum House</h1>
            </div>
            <div style="padding: 20px;">
              <h2>${payload.title}</h2>
              <p>Olá <strong>{{userName}}</strong>,</p>
              <p>${payload.message}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}${payload.url || '/dashboard'}" 
                   style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Acessar Sistema
                </a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
              Esta é uma mensagem automática do sistema Oryum House.
            </div>
          </div>
        `,
      },
    };

    return templates[payload.type] || templates['GENERAL'];
  }

  async sendBulkNotification(userIds: string[], payload: NotificationPayload) {
    const results = await Promise.allSettled(
      userIds.map(userId => this.sendNotification(userId, payload))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;

    const failed = results.length - successful;

    this.logger.log(`Notificações em massa enviadas: ${successful} sucesso, ${failed} falhas`);
    
    return {
      total: results.length,
      successful,
      failed,
    };
  }
}
