import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmailProviderIsGoogleResponseDto {
  @Field()
  emailAddress!: string;

  @Field()
  isGoogle!: boolean;
}
