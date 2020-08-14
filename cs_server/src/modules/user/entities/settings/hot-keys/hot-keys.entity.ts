import { Field, ObjectType } from '@nestjs/graphql';
import { HotKey } from './hot-key.entity';

@ObjectType()
export class HotKeys {
  @Field(() => [HotKey])
  formatting: HotKey[];
  @Field(() => [HotKey])
  general: HotKey[];
}
