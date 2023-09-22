import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

@InputType('PatternAddInput')
export class AddPatternRequest {
  @Field({ description: 'Pattern name. Max length 255 chars' })
  @MaxLength(255)
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  @MaxLength(255)
  expression!: string;

  @Field(() => Rule)
  rule!: Rule;
}
