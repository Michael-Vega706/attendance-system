import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseStudent } from 'src/entities/course-student.entity';
import { Course } from 'src/entities/course.entity';
import { UserType } from 'src/entities/user.entity';
import { CourseModel } from 'src/models/education.model';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseStudent)
    private courseStudentRepository: Repository<CourseStudent>,
  ) {}

  async save(payload: CourseModel) {
    return await this.courseRepository.save(payload);
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOneById(id: number) {
    return await this.courseRepository.findOneBy({ id });
  }

  async deleteOneById(id: number) {
    await this.courseRepository.delete({ id });
  }

  async updateOneById(id: number, payload: CourseModel) {
    await this.courseRepository.update(id, payload);
  }

  async assignStudentsToCourse(course_id: number, student_ids: number[]) {
    const courseDB = await this.findOneById(course_id);
    if (courseDB) {
      await this.courseStudentRepository.delete({ course: courseDB });
      const studentSaved: any[] = [];
      for (const student_id of student_ids) {
        const user = await this.usersService.findById(student_id);
        if (user && user.userType === UserType.STUDENT.toString()) {
          const saveItem = await this.courseStudentRepository.save({
            course: courseDB,
            user,
          });
          studentSaved.push({
            id: saveItem.user.id,
          });
        }
      }
      return { ...courseDB, students: studentSaved };
    }
    throw new NotFoundException("Can't assign students to course.");
  }

  async studentList(course_id: number) {
    const courseDB = await this.findOneById(course_id);
    if (courseDB) {
      const courseStudents = await this.courseStudentRepository.find({
        where: { course: courseDB },
        relations: ['user'],
      });
      if (courseStudents) {
        return courseStudents.map((el) => {
          return {
            id: el.id,
            student: {
              id: el.user.id,
              username: el.user.username,
              email: el.user.email,
            },
            hasView: el.hasView,
          };
        });
      }
    }
    throw new NotFoundException(`Course with id ${course_id} not found.`);
  }

  async updateAttendance(
    course_id: number,
    student_id: number,
    payload: { hasView: boolean },
  ) {
    const courseDB = await this.findOneById(course_id);
    if (courseDB) {
      const userDB = await this.usersService.findById(student_id);
      if (userDB) {
        const courseStudents = await this.courseStudentRepository.findOne({
          where: { course: courseDB, user: userDB },
          relations: ['user'],
        });

        if (courseStudents) {
          await this.courseStudentRepository.update(courseStudents.id, payload);
          return;
        }
      }
      throw new NotFoundException(`Student with id ${student_id} not found.`);
    }
    throw new NotFoundException(`Course with id ${course_id} not found.`);
  }
}
