import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import {IsEnum} from "class-validator";

@Entity("kind")
export class KindEntity {
  @PrimaryColumn()
  @IsEnum([ 1, 2 ])
  @OneToMany(() => UserEntity, (user) => user.kind)
  id: number;

  @Column()
  type: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
