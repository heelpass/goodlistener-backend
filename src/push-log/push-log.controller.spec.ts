import { Test, TestingModule } from '@nestjs/testing';
import { PushLogController } from './push-log.controller';

describe('PushLogController', () => {
  let controller: PushLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushLogController],
    }).compile();

    controller = module.get<PushLogController>(PushLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
