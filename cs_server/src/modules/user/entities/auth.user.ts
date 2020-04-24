import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUser {
  @Field()
  user: User;
  @Field()
  token: string;
}
