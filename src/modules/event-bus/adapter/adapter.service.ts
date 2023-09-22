import PubsubService from '@app/modules/event-bus/adapter/pubsub/pubsub.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdapterService {
  constructor(public readonly adapter: PubsubService) {}
}
