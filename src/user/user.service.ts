import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>
  ) {}

  async create(
    snsHash: string,
    snsKind: string,
    email: string,
    nickname: string,
    gender: string,
    ageRange: string,
    job: string,
    fcmHash?: string
  ) {
    const findExistUser = await this.repo.findOne({
      where: {
        nickname: nickname,
      },
    });

    if (!findExistUser) {
      const user = this.repo.create({
        snsHash,
        snsKind,
        email,
        nickname,
        gender,
        ageRange,
        job,
        fcmHash,
      });
      return this.repo.save(user);
    } else {
      throw new NotAcceptableException('already exist nickname = ' + nickname);
    }
  }

  async findByHash(snsHash: string) {
    const user = await this.repo.findOne({
      where: {
        snsHash: snsHash,
      },
    });
    return user;
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({
      where: {
        id: id,
      },
    });
  }

  async find(email: string) {
    return this.repo.find({
      where: {
        email: email,
      },
    });
  }

  async checkNickName(nickname: string) {
    const isExistNickName = await this.repo.find({ where: { nickname } });
    return isExistNickName.length !== 0;
  }

  async update(id: number, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found = ' + id);
    }
    console.log('attrs = ' + JSON.stringify(attrs));
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found = ' + id);
    }
    return this.repo.remove(user);
  }
}
