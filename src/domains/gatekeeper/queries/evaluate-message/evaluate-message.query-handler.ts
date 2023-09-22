import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
  EvaluateMessageResult,
  GatekeeperService,
} from '../../gatekeeper.service';

import { EvaluateMessageQuery } from './evaluate-message.query';

@QueryHandler(EvaluateMessageQuery)
export class EvaluateMessageQueryHandler
  implements IQueryHandler<EvaluateMessageQuery>
{
  constructor(private gatekeeperService: GatekeeperService) {}

  async execute(query: EvaluateMessageQuery): Promise<EvaluateMessageResult> {
    return this.gatekeeperService.evaluateMessage(query.message);
  }
}
