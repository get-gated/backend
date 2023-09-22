import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import DonationRequestInteractionEntity from '../../entities/donation-request-interaction.entity';

@ObjectType('DonationEdge')
export class DonationRequestEdge extends Edge<DonationRequestInteractionEntity> {
  @Field(() => DonationRequestInteractionEntity)
  node: DonationRequestInteractionEntity;

  constructor(props: DonationRequestEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('DonationsConnection')
export class DonationsResponseDto extends Connection<DonationRequestInteractionEntity> {
  @Field(() => [DonationRequestEdge])
  edges!: DonationRequestEdge[];

  constructor(props: DonationsResponseDto) {
    super(props);
    this.edges = props.edges;
  }
}
