import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Secrets } from './secrets';
import { Settings } from './settings/settings.entity';

@ObjectType()
export class AuthUser {
  @Field()
  user: User;
  @Field()
  token: string;

  @Field(() => Settings)
  settings: Settings;

  @Field(() => Secrets)
  secrets: Secrets;
}
