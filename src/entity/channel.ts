import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import {IsString} from "class-validator";
import {ReviewEntity} from "./review";

@Entity("channel")
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  @OneToMany(() => ReviewEntity, (review) => review.channel)
  id: number;

  @Column()
  @IsString()
  channel: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: "speakerId" })
  speaker: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: "listenerId" })
  listener: UserEntity;

  @Column()
  isSpeakerIn: boolean;

  @Column()
  isListenerIn: boolean;

  @Column()
  meetingTime: Date;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;
}
