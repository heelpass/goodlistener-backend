import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("channel")
export class ChannelEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
