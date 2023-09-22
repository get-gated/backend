import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import HistoryMessageEntity from '../../entities/history-message.entity';

@ObjectType('MessageEdge')
export class MessageEdge extends Edge<HistoryMessageEntity> {
  @Field(() => HistoryMessageEntity)
  node: HistoryMessageEntity;

  constructor(props: MessageEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('MessagesCollection')
export class MessagesResponse extends Connection<HistoryMessageEntity> {
  @Field(() => [MessageEdge])
  edges: MessageEdge[];

  constructor(props: MessagesResponse) {
    super(props);
    this.edges = props.edges;
  }
}
