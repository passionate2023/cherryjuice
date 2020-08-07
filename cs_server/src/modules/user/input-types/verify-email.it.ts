import { Field, InputType } from '@nestjs/graphql';

@InputType('VerifyEmailIt')
export class VerifyEmailIt {
  @Field()
  token: string;
}
