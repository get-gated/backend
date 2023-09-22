import { Field, InputType } from '@nestjs/graphql';

@InputType('NonprofitsInput')
export class NonprofitsRequest {
  @Field({ nullable: true })
  readonly isDisplay?: boolean;

  @Field({ nullable: true })
  readonly categoryId?: string;

  @Field({ nullable: true })
  readonly search?: string;

  @Field({ nullable: true })
  readonly isFeatured?: boolean;
}
