import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { GamificationHelper } from './gamification.helper';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { WebSocketModule } from '../../core/websocket/websocket.module';

@Module({
  imports: [PrismaModule, WebSocketModule],
  controllers: [GamificationController],
  providers: [GamificationService, GamificationHelper],
  exports: [GamificationService, GamificationHelper],
})
export class GamificationModule {}
