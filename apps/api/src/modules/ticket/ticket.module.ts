import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { WebSocketModule } from '../../core/websocket/websocket.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [WebSocketModule, GamificationModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
