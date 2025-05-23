import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';
import { Attachment } from './attachment.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;
  @ManyToOne(() => User)
  @JoinColumn()
  teacher: User;
  @ManyToMany(() => Attachment)
  @JoinTable()
  resources?: Attachment[];
}
