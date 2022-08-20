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
} from "typeorm";
import { KindEntity } from "./kind";

@Entity("user")
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
  gender: string;

  @Column()
  ageRange: string;

  @Column()
  job: string;

  @Column()
  fcmHash: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
