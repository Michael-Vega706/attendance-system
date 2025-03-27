import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AttachmentModel } from 'src/models/education.model';

@Controller('attachment')
export class AttachmentController {
  @Post('/')
  @ApiBody({
    type: AttachmentModel,
  })
  createAttachment(@Body() payload: AttachmentModel) {
    return payload;
  }
}
