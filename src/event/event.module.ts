import {Module} from '@nestjs/common';
import {EventGateway} from "./event.gateway";
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  providers: [EventGateway, EventService],
  controllers: [EventController],
})
export class EventModule {}
