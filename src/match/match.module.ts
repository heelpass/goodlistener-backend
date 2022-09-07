import {Module} from '@nestjs/common';
import {MatchController} from './match.controller';
import {MatchService} from './match.service';
import {UserEntity} from "../entity/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChannelEntity} from "../entity/channel";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChannelEntity])],
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}
