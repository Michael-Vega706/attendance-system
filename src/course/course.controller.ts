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
import { CourseService } from './course.service';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  CourseRequest,
  CourseResponse,
  CourseStudentRequest,
  CourseStudentResponse,
  CourseStudentsResponse,
} from '../responses/education.response';
import { CourseModel } from '../models/education.model';
import { ErrorResponse } from '../responses/auth.response';

@Controller('course')
@ApiBearerAuth()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/')
  @ApiBody({
    type: CourseRequest,
  })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponse })
  createCourse(@Body() payload: CourseModel) {
    return this.courseService.save(payload);
  }

  @Get('/')
  @ApiResponse({ status: HttpStatus.OK, type: [CourseResponse] })
  listCourses() {
    return this.courseService.findAll();
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  async getOneCourse(@Param('id') id: number) {
    const item = await this.courseService.findOneById(id);
    if (item) {
      return item;
    } else {
      throw new NotFoundException(`Course with id ${id}, not found.`);
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Without description',
  })
  deleteOneCourse(@Param('id') id: number) {
    return this.courseService.deleteOneById(id);
  }

  @Put('/:id')
  @ApiBody({
    type: CourseRequest,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  updateOneCourse(@Param('id') id: number, @Body() payload: CourseModel) {
    return this.courseService.updateOneById(id, payload);
  }

  @Post('/:id/assign-students')
  @ApiBody({
    type: [Number],
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CourseStudentsResponse })
  assignStudentsToCourse(@Param('id') id: number, @Body() payload: number[]) {
    return this.courseService.assignStudentsToCourse(id, payload);
  }

  @Get('/:id/students')
  @ApiResponse({ status: HttpStatus.OK, type: [CourseStudentResponse] })
  listStudentsByCourse(@Param('id') id: number) {
    return this.courseService.studentList(id);
  }

  @Put('/:id/student/:studentId/attendance')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @ApiBody({
    type: CourseStudentRequest,
  })
  updateStudentAttendanceById(
    @Param('id') id: number,
    @Param('studentId') studentId: number,
    @Body() payload: { hasView: boolean },
  ) {
    return this.courseService.updateAttendance(id, studentId, payload);
  }
}
