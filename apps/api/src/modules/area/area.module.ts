import { Module } from '@nestjs/common';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
