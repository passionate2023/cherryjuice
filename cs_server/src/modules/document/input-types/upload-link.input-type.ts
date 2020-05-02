import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UploadLinkInputType {
  @Field(() => [String])
  IDs: string[];

  @Field()
  access_token: string;
}
