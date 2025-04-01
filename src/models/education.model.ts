import { IsNumber, IsString, IsUrl, MinLength } from 'class-validator';
import { UserModel } from './user.model';

export class AttachmentModel {
  id?: number;

  @IsString()
  @MinLength(4)
  name: string;

  @IsUrl()
  url: string;
}

export class CourseModel {
  id?: number;

  @IsString()
  @MinLength(4)
  name: string;
}

export class LessonModel {
  id?: number;

  @IsString()
  @MinLength(4)
  name: string;

  @IsNumber()
  course: CourseModel;

  @IsNumber()
  teacher: UserModel;
}
