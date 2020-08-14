import { Field, ObjectType } from '@nestjs/graphql';
import { HotKeys } from './hot-keys/hot-keys.entity';

@ObjectType()
export class Settings {
  @Field(() => HotKeys)
  hotKeys: HotKeys;
}
