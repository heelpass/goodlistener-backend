import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";
import {ChannelEntity} from "../entity/channel";
import {addDays, format, parseISO} from 'date-fns';
import {randomUUID} from "crypto";
import {convertDateTime, convertFitNotInQuery, convertUnixTimeStamp} from "../helper/convertDate";

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(ChannelEntity) private channelRepo: Repository<ChannelEntity>
  ) {
  }

  async matchListener(matchDate: Date) {
    // sql 로 들어오는 날짜의 시간에 일주일을 더한 값 사이에 channel의 MeetingTime이 포함 안되는 유저들을 뽑는다.
    return this.userRepo.createQueryBuilder('u')
      .where(`u.id not in (select distinct c.listenerId from channel c
             where UNIX_TIMESTAMP(c.meetingTime) in (${convertFitNotInQuery(matchDate)}))`)
      .andWhere('u.kindId = 1')
      .getMany();
  }

  async randomUserMatch(users: UserEntity[]): Promise<UserEntity> {
    // 유저의 인덱스 번호중 랜덤하게 1개의 인덱스만 출력
    return users[Math.floor(Math.random() * users.length)];
  }

  async insertChannel(speakerId: number, listenerId: number, meetingTime: Date, applyDesc: string) {
    let responseChannel: ChannelEntity;
    const speaker = this.userRepo.findOne({
      where: {
        id: speakerId,
      },
    });

    const listener = this.userRepo.findOne({
      where: {
        id: listenerId,
      },
    });
    for (let i = 0; i < 7; i++) {
      const channelEntity = new ChannelEntity();
      channelEntity.channel = randomUUID();
      channelEntity.applyDesc = applyDesc;
      channelEntity.speaker = await speaker;
      channelEntity.listener = await listener;
      channelEntity.meetingTime = new Date(format(addDays(parseISO(meetingTime.toLocaleString()), i), 'yyyy-MM-dd HH:mm:ss'));
      channelEntity.isStartDate = (i === 0);

      const channel = this.channelRepo.create(channelEntity);
      if (i === 0) {
        responseChannel = await this.channelRepo.save(channel);
      } else {
        await this.channelRepo.save(channel);
      }
    }

    return responseChannel;
  }

  async getMyListener(userId: number) {
    const channel = this.channelRepo.findOne({
      relations: {speaker: true, listener: true},
      where: {speaker: {id: userId}, deletedAt: null, isStartDate: true}
    });
    const channelEntity = await channel;
    const convertKrDate = new Date(channelEntity.meetingTime).getTime() + 32400;
    const meetingTime = convertDateTime(new Date(convertKrDate));
    const listener = this.userRepo.findOne({
      where: {id: channelEntity.listener.id}
    });
    const listenerEntity = await listener;
    if(listenerEntity) {
      return {
        nickname: listenerEntity.nickname,
        description: listenerEntity.description,
        meetingTime: meetingTime
      };
    } else {
      return null;
    }
  }

  async getMySpeaker(userId: number) {
    let mySpeakers = [];
    const channel = this.channelRepo.find({
      relations: {listener: true, speaker: true},
      where: {listener: {id: userId}, deletedAt: null, isStartDate: true}
    });
    const channelEntity = await channel;
    for (const channel of channelEntity) {
      const speaker = this.userRepo.findOne({
        where: {id: channel.speaker.id}
      });
      const speakerEntity = await speaker;
      const convertKrDate = new Date(channel.meetingTime).getTime() + 32400;
      const meetingTime = convertDateTime(new Date(convertKrDate));
      mySpeakers.push(
        {
          nickname: speakerEntity.nickname,
          description: speakerEntity.description,
          meetingTime: meetingTime
        })
    }
    return mySpeakers;
  }
}
