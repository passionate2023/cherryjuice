import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Secrets } from './secrets';

@ObjectType()
export class AuthUser {
  @Field()
  user: User;
  @Field()
  token: string;

  @Field(() => Secrets)
  secrets: Secrets;
}
