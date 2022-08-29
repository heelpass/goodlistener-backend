import { IsEnum, isEnum, isIn } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KindEntity } from './kind';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => KindEntity, (kind) => kind.id)
  @JoinColumn()
  kind: KindEntity;

  @Column()
  snsHash: string;

  @Column()
  snsKind: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  @IsEnum(['mail', 'female'])
  gender: string;

  @Column()
  @IsEnum(['10', '20', '30', '40'])
  ageRange: string;

  @Column()
  @IsEnum(['student', 'worker', 'freelancer', 'jobseeker', 'etc'])
  job: string;

  @Column()
  fcmHash: string;

  @Column()
  profileImg: number;

  @Column()
  description: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
