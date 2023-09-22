import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import DonationRequestEntity from '../../entities/donation-request.entity';

@ObjectType('DonationRequestEdge')
export class DonationRequestEdge extends Edge<DonationRequestEntity> {
  @Field(() => DonationRequestEntity)
  node: DonationRequestEntity;

  constructor(props: DonationRequestEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('DonationRequestsConnection')
export class DonationRequestsResponseDto extends Connection<DonationRequestEntity> {
  @Field(() => [DonationRequestEdge])
  edges!: DonationRequestEdge[];

  constructor(props: DonationRequestsResponseDto) {
    super(props);
    this.edges = props.edges;
  }
}
