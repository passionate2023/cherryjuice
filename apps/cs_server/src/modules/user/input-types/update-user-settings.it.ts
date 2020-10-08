import { Field, InputType } from '@nestjs/graphql';
import { HotKeys } from '../entities/settings/hot-keys/hot-keys.entity';
import { EditorSettings } from '../entities/settings/editor-settings';

@InputType()
export class UpdateUserSettingsIt {
  @Field(() => HotKeys, { nullable: true })
  hotKeys?: HotKeys;

  @Field(() => EditorSettings, { nullable: true })
  editorSettings?: EditorSettings;
}
