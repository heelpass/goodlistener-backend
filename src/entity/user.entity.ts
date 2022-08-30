import {IsEnum} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {KindEntity} from './kind';

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
  @IsEnum([1, 2, 3, 4, 5, 6, 7, 8, 9])
  wantImg: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
