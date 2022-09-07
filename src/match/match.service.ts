import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";
import {ChannelEntity} from "../entity/channel";
import {addDays, format, parseISO} from 'date-fns';
import {randomUUID} from "crypto";
import {convertFitNotInQuery} from "../helper/convertDate";

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(ChannelEntity) private channelRepo: Repository<ChannelEntity>
  ) {
  }

  async getUserMeetingTime(userId: number) {
    let meetingTimes: Date[] = [];
    console.log("userId = " + userId);
    // sql 로 들어오는 날짜의 시간에 일주일을 더한 값 사이에 channel의 MeetingTime이 포함 안되는 유저들을 뽑는다.
    const channelRows = this.channelRepo.createQueryBuilder('c')
      .innerJoin(UserEntity, 'u', 'u.id = c.listenerId')
      .where('c.listenerId = :id', {id: 234})
      .getMany();
    console.log("channelRows =  " + JSON.stringify(channelRows));

    if (Object.keys(channelRows).length !== 0) {
      channelRows.then(channel => {
        channel.forEach(row => {
          meetingTimes.push(row.meetingTime);
        })
      }).finally(() => {
        return meetingTimes;
      })
    } else {
      return meetingTimes;
    }
  }

  async matchListener(matchDate: Date) {
    // sql 로 들어오는 날짜의 시간에 일주일을 더한 값 사이에 channel의 MeetingTime이 포함 안되는 유저들을 뽑는다.
    console.log("convertFitNotInQuery(matchDate) = " + convertFitNotInQuery(matchDate));
    return this.userRepo.createQueryBuilder('u')
      .distinct(true)
      .leftJoin(ChannelEntity, 'c', `u.id = c.listenerId and UNIX_TIMESTAMP(c.meetingTime) not in (${convertFitNotInQuery(matchDate)})`)
      .andWhere('u.kindId = 1')
      .andWhere('c.deletedAt is null')
      .getMany();
  }

  async randomUserMatch(users: UserEntity[]): Promise<UserEntity> {
    // 유저의 인덱스 번호중 랜덤하게 1개의 인덱스만 출력
    return users[Math.floor(Math.random() * users.length)];
  }

  async insertChannel(speakerId: number, listenerId: number, meetingTime: Date, applyDesc: string) {
    let responseChannel:ChannelEntity;
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
      if(i === 0) {
        responseChannel = await this.channelRepo.save(channel);
      } else {
        await this.channelRepo.save(channel);
      }
    }

    return responseChannel;
  }

  async getMyListener(userId: number) {
    const channel = this.channelRepo.findOne({
      relations: { speaker: true },
      where: { speaker: { id: userId }, deletedAt: null, isStartDate: true}
    });
    const channelEntity = await channel;
    const listener = this.userRepo.findOne({
      where: { id : channelEntity.listener.id }
    });
    const listenerEntity = await listener;
    return {
      nickname: listenerEntity.nickname,
      description: listenerEntity.description,
      meetingTime: channelEntity.meetingTime
    };
  }

  // async getMySpeaker(userId: number) {
  //   const channel = this.channelRepo.find({
  //     relations: { listener: true },
  //     where: { listener: { id: userId }, deletedAt: null, isStartDate: true}
  //   });
  //   const channelEntity = await channel;
  //   for (const channel of channelEntity) {
  //     const speaker = this.userRepo.findOne({
  //       where: { id : channel.speaker.id }
  //     });
  //     const speakerEntity = await speaker;
  //   }
  //   const speakerEntity = await speaker;
  //   return {
  //     nickname: listenerEntity.nickname,
  //     description: listenerEntity.description,
  //     meetingTime: channelEntity.meetingTime
  //   };
  // }
}
