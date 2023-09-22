// implements https://relay.dev/graphql/connections.htm

import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('PageInfo')
export class PageInfo {
  @Field()
  hasPreviousPage: boolean;

  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;

  @Field()
  totalResults?: number;

  constructor(props: PageInfo) {
    this.hasNextPage = props.hasNextPage;
    this.hasPreviousPage = props.hasPreviousPage;
    this.startCursor = props.startCursor;
    this.endCursor = props.endCursor;
    this.totalResults = props.totalResults;
  }
}

@ObjectType({ isAbstract: true })
export abstract class Edge<EdgeType> {
  @Field()
  public readonly cursor: string;

  abstract readonly node: EdgeType;

  constructor(props: Edge<EdgeType>) {
    this.cursor = props.cursor;
  }
}

@ObjectType({ isAbstract: true })
export abstract class Connection<EdgeType> {
  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => [Edge])
  abstract edges: Edge<EdgeType>[];

  constructor(props: Pick<Connection<any>, 'pageInfo'>) {
    this.pageInfo = props.pageInfo;
  }
}

@ArgsType()
@InputType()
export class Pagination {
  @Field({ nullable: true })
  first?: number;

  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  last?: number;

  @Field({ nullable: true })
  before?: string;
}
