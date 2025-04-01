import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity()
@Index(['course', 'user'], { unique: true })
export class CourseStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ default: false })
  hasView: boolean;
}
