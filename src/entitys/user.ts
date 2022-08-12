import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { KindEntity } from "./kind";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => KindEntity, {
    cascade: true,
  })
  @JoinColumn()
  kind: KindEntity;

  @Column()
  socialId: string;

  @Column()
  nickname: string;

  @Column()
  platformType: string;

  @Column()
  gender: string;

  @Column()
  ageRange: string;

  @Column()
  job: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
