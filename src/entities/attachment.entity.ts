import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  url: string;
  @ManyToMany(() => Lesson)
  @JoinTable()
  students: Lesson[];
}
