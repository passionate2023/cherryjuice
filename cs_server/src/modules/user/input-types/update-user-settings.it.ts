import { Field, InputType } from '@nestjs/graphql';
import { HotKeys } from '../entities/settings/hot-keys/hot-keys.entity';

@InputType()
export class UpdateUserSettingsIt {
  @Field(() => HotKeys, { nullable: true })
  hotKeys?: HotKeys;
}
