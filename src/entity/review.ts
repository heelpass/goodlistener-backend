import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {IsEnum, IsNumber, IsString} from "class-validator";
import {ChannelEntity} from "./channel";

@Entity("review")
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChannelEntity, (channel) => channel.id)
  @JoinColumn()
  channel: ChannelEntity;

  @Column()
  @IsString()
  @IsEnum(['listener', 'speaker'])
  writer: string;

  @Column()
  @IsString()
  @IsEnum(['listener', 'speaker'])
  receiver: string;

  @Column()
  @IsString()
  review: string;

  @Column()
  @IsNumber()
  feeling: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
