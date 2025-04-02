import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AttachmentModel } from 'src/models/education.model';
import { AttachmentService } from './attachment.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  AttachmentRequest,
  AttachmentResponse,
} from 'src/responses/education.response';
import { CacheService } from 'src/cache/cache.service';

@Controller('attachment')
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
    console.log(value);
    if (value) {
      return value;
    } else {
      const attachmentDB = await this.attachmentService.findOneById(id);
      await this.cacheService.set(key, attachmentDB);
      return attachmentDB;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Without description',
  })
  deleteOneAttachment(@Param('id') id: number) {
    return this.attachmentService.deleteOneById(id);
  }

  @Put('/:id')
  @ApiBody({
    type: AttachmentRequest,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  updateOneAttachment(
    @Param('id') id: number,
    @Body() payload: AttachmentModel,
  ) {
    return this.attachmentService.updateOneById(id, payload);
  }
}
