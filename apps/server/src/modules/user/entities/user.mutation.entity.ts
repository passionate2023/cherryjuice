import { AuthUser } from './auth.user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserMutation {
  @Field(() => AuthUser)
  signIn: AuthUser;
  @Field(() => AuthUser)
  signUp: AuthUser;
}
@ObjectType()
export class UserQuery {
  @Field(() => AuthUser)
  refreshToken: AuthUser;
  @Field(() => String, { nullable: true })
  userExists: string;
}
