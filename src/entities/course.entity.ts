import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  // @ManyToMany(() => User)
  // @JoinTable()
  // students: User[];
}
