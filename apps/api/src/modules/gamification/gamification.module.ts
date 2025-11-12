import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { GamificationHelper } from './gamification.helper';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GamificationController],
  providers: [GamificationService, GamificationHelper],
  exports: [GamificationService, GamificationHelper],
})
export class GamificationModule {}
