import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

export enum UserType {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ type: 'varchar', length: 60, unique: true })
  email: string;
  @Column({ type: 'enum', enum: UserType, default: UserType.STUDENT })
  userType: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ default: false })
  hasReset: boolean;
  @ManyToMany(() => Role)
  @JoinTable()
  roles?: Role[];
}
