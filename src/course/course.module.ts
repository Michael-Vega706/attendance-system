import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { CourseStudent } from 'src/entities/course-student.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, CourseStudent])],
  controllers: [CourseController],
  providers: [CourseService, UsersService],
})
export class CourseModule {}
