import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {UserEntity} from "./user.entity";
import {IsString} from "class-validator";
import {ReviewEntity} from "./review";

@Entity("channel")
export class ChannelEntity {
  @BeforeInsert()
  beforeInsertActions() {
    this.isSpeakerIn = false;
    this.isListenerIn = false;
  }

  @PrimaryGeneratedColumn()
  @OneToMany(() => ReviewEntity, (review) => review.channel)
  id: number;

  @Column()
  @IsString()
  channel: string;

  @Column({length: 100})
  @IsString()
  applyDesc: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "speakerId" })
  speaker: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "listenerId" })
  listener: UserEntity;

  @Column({ nullable: false, select: false})
  isSpeakerIn: boolean;

  @Column({ nullable: false, select: false})
  isListenerIn: boolean;

  @Column({ nullable: false, select: false, default: false})
  isStartDate: boolean;

  @Column()
  meetingTime: Date;

  @Column({ nullable: true})
  startTime: Date;

  @Column({nullable: true})
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
