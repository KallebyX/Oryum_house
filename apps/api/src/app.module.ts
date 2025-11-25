import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';

// Core modules
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './core/auth/auth.module';
import { NotificationModule } from './core/notification/notification.module';
import { FileUploadModule } from './core/file-upload/file-upload.module';
import { WebSocketModule } from './core/websocket/websocket.module';
import { CacheModule } from './core/cache/cache.module';

// Feature modules
import { CondominiumModule } from './modules/condominium/condominium.module';
import { UnitModule } from './modules/unit/unit.module';
import { UserModule } from './modules/user/user.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AreaModule } from './modules/area/area.module';
import { BookingModule } from './modules/booking/booking.module';
import { NoticeModule } from './modules/notice/notice.module';
import { AssemblyModule } from './modules/assembly/assembly.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { VisitorModule } from './modules/visitor/visitor.module';
import { DocumentModule } from './modules/document/document.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { IncidentModule } from './modules/incident/incident.module';
import { ReportModule } from './modules/report/report.module';
import { GamificationModule } from './modules/gamification/gamification.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Logging - Now enabled with Pino
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        customProps: () => ({
          context: 'HTTP',
        }),
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),

    // Scheduling - Now enabled for cron jobs
    ScheduleModule.forRoot(),

    // Core modules
    PrismaModule,
    AuthModule,
    NotificationModule,
    FileUploadModule,
    WebSocketModule,
    CacheModule,

    // Feature modules
    CondominiumModule,
    UnitModule,
    UserModule,
    TicketModule,
    AreaModule,
    BookingModule,
    NoticeModule,
    AssemblyModule,
    DeliveryModule,
    VisitorModule,
    DocumentModule,
    MaintenanceModule,
    IncidentModule,
    ReportModule,
    GamificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Enable rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
