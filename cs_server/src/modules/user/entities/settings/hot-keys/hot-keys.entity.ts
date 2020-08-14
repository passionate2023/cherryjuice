import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { HotKey } from './hot-key.entity';

@InputType('HotKeysIt')
@ObjectType('HotKeys')
export class HotKeys {
  @Field(() => [HotKey])
  formatting: HotKey[];
  @Field(() => [HotKey])
  general: HotKey[];
}
