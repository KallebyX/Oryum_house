import { Module } from '@nestjs/common';
import { CondominiumService } from './condominium.service';
import { CondominiumController } from './condominium.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { FileUploadModule } from '../../core/file-upload/file-upload.module';

@Module({
  imports: [PrismaModule, FileUploadModule],
  controllers: [CondominiumController],
  providers: [CondominiumService],
  exports: [CondominiumService],
})
export class CondominiumModule {}
