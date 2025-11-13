import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller';
import { AssemblyService } from './assembly.service';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, GamificationModule],
  controllers: [AssemblyController],
  providers: [AssemblyService],
  exports: [AssemblyService],
})
export class AssemblyModule {}
