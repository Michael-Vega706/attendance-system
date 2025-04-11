import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AttachmentModel } from '../models/education.model';
import { AttachmentService } from './attachment.service';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  AttachmentRequest,
  AttachmentResponse,
} from '../responses/education.response';
import { CacheService } from '../cache/cache.service';

@Controller('attachment')
@ApiBearerAuth()
export class AttachmentController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly attachmentService: AttachmentService,
  ) {}

  @Post('/')
  @ApiBody({
    type: AttachmentRequest,
  })
  @ApiResponse({ status: HttpStatus.OK, type: AttachmentResponse })
  createAttachment(@Body() payload: AttachmentModel) {
    return this.attachmentService.save(payload);
  }

  @Get('/')
  @ApiResponse({ status: HttpStatus.OK, type: [AttachmentResponse] })
  listAttachments() {
    return this.attachmentService.findAll();
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: AttachmentResponse })
  async getOneAttachment(@Param('id') id: number) {
    const key = `/attachment/${id}`;
    const value = await this.cacheService.get(key);
    if (value) {
      return value;
    } else {
      const attachmentDB = await this.attachmentService.findOneById(id);
      if (attachmentDB) {
        await this.cacheService.set(key, attachmentDB);
        return attachmentDB;
      } else {
        throw new NotFoundException(`Attachment with id ${id}, not found.`);
      }
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Without description',
  })
  async deleteOneAttachment(@Param('id') id: number) {
    const key = `/attachment/${id}`;
    await this.cacheService.delete(key);
    return this.attachmentService.deleteOneById(id);
  }

  @Put('/:id')
  @ApiBody({
    type: AttachmentRequest,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOneAttachment(
    @Param('id') id: number,
    @Body() payload: AttachmentModel,
  ) {
    const key = `/attachment/${id}`;
    const attachmentDB = await this.attachmentService.updateOneById(id, payload);
    await this.cacheService.set(key, attachmentDB);
    return attachmentDB;
  }
}
