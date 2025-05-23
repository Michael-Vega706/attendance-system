import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  url: string;
}
