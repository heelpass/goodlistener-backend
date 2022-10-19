import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushLog } from 'src/entity/PushLog';
import { Repository } from 'typeorm';

@Injectable()
export class PushLogService {
  constructor(
    @InjectRepository(PushLog) private pushLogRepo: Repository<PushLog>
  ) {}

  async notReadPush(userFcm: string) {
    const pushList = await this.pushLogRepo.findAndCount({
      where: { userFcm: userFcm, isRead: false },
    });

    return { data: pushList[0], count: pushList[1] };
  }

  async readPush(userFcm: string, messageHash: string) {
    const log = await this.pushLogRepo.update(
      { userFcm: userFcm, hash: messageHash },
      { isRead: true }
    );

    if (log.affected === 0) {
      throw new NotFoundException('해당하는 토큰을 찾을 수 없습니다.');
    }

    return log;
  }

  async savePush(
    userFcm: string,
    title: string,
    content: string,
    flag: string,
    hash: string
  ) {
    return await this.pushLogRepo.save({
      userFcm,
      title,
      content,
      isRead: false,
      hash,
      flag,
    });
  }
}
