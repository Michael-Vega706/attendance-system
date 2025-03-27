import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToOne(() => Course)
  @JoinColumn()
  course: Course;
  @OneToOne(() => User)
  @JoinColumn()
  teacher: User;
}
