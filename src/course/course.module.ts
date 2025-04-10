import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../entities/course.entity';
import { CourseStudent } from '../entities/course-student.entity';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, CourseStudent])],
  controllers: [CourseController],
  providers: [CourseService, UsersService],
})
export class CourseModule {}
