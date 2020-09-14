import { Field, ObjectType } from '@nestjs/graphql';
import { HotKeys } from './hot-keys/hot-keys.entity';
import { EditorSettings } from './editor-settings/editor-settings';

@ObjectType()
export class Settings {
  @Field(() => HotKeys)
  hotKeys: HotKeys;

  @Field(() => EditorSettings)
  editorSettings: EditorSettings;
}
