import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInCredentials {
  @Field()
  emailOrUsername: string;
  @Field()
  password: string;
}
