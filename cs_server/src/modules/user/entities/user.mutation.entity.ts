import { AuthUser } from './auth.user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserMutation {
  @Field(() => AuthUser)
  signIn: AuthUser;
  @Field(() => AuthUser)
  signUp: AuthUser;
}
