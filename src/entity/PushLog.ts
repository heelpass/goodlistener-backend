import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('pushLog')
export class PushLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userFcm: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isRead: boolean;

  @Column()
  hash: string;

  @Column()
  flag: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
