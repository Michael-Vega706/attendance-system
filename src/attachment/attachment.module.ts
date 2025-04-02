import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { Attachment } from 'src/entities/attachment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment]), CacheModule],
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
