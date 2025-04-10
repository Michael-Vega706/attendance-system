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
import { LessonService } from './lesson.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  AttachmentResponse,
  LessonAttachmentResponse,
  LessonRequest,
  LessonResponse,
} from '../responses/education.response';
import { LessonModel } from '../models/education.model';
import { ErrorResponse } from '../responses/auth.response';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('/')
  @ApiBody({
    type: LessonRequest,
  })
  @ApiResponse({ status: HttpStatus.OK, type: LessonResponse })
  createCourse(@Body() payload: LessonModel) {
    return this.lessonService.save(payload);
  }

  @Get('/')
  @ApiResponse({ status: HttpStatus.OK, type: [LessonResponse] })
  async listCourses() {
    const lessonList = await this.lessonService.findAll();
    return lessonList.map((el) => {
      return {
        ...el,
        teacher: {
          id: el.teacher.id,
          username: el.teacher.username,
          email: el.teacher.email,
        },
      };
    });
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: LessonResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  async getOneCourse(@Param('id') id: number) {
    const item = await this.lessonService.findOneById(id);
    if (item) {
      return {
        ...item,
        teacher: {
          id: item.teacher.id,
          username: item.teacher.username,
          email: item.teacher.email,
        },
      };
    } else {
      throw new NotFoundException(`Lesson with id ${id}, not found.`);
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Without description',
  })
  deleteOneCourse(@Param('id') id: number) {
    return this.lessonService.deleteOneById(id);
  }

  @Put('/:id')
  @ApiBody({
    type: LessonRequest,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  updateOneCourse(@Param('id') id: number, @Body() payload: LessonModel) {
    return this.lessonService.updateOneById(id, payload);
  }

  @Post('/:id/assign-attachments')
  @ApiBody({
    type: [Number],
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: LessonAttachmentResponse })
  async assignAttachmentToLesson(
    @Param('id') id: number,
    @Body() payload: number[],
  ) {
    const lessonAttachment = await this.lessonService.assignAttachmentToLesson(
      id,
      payload,
    );
    return {
      ...lessonAttachment,
      teacher: {
        id: lessonAttachment.teacher.id,
        username: lessonAttachment.teacher.username,
        email: lessonAttachment.teacher.email,
      },
    };
  }

  @Get('/:id/attachments')
  @ApiResponse({ status: HttpStatus.OK, type: [AttachmentResponse] })
  listAttachmentByLesson(@Param('id') id: number) {
    return this.lessonService.attachmentList(id);
  }
}
