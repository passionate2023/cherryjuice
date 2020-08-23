import { Field, InputType } from '@nestjs/graphql';

@InputType('ConfirmEmailChangeIt')
export class ConfirmEmailChangeIt {
  @Field()
  token: string;
}
