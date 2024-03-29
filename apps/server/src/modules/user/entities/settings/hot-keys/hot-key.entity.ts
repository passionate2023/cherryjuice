import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum HotKeyActionType {
  SAVE_DOCUMENT = 'SAVE_DOCUMENT',
  RELOAD_DOCUMENT = 'RELOAD_DOCUMENT',
  SHOW_DOCUMENTS_LIST = 'SHOW_DOCUMENTS_LIST',
  SHOW_IMPORT_DOCUMENTS = 'SHOW_IMPORT_DOCUMENTS',
  SHOW_CREATE_DOCUMENT = 'SHOW_CREATE_DOCUMENT',
  SHOW_CREATE_SIBLING_NODE = 'SHOW_CREATE_SIBLING_NODE',
  ITALIC = 'ITALIC',
  BOLD = 'BOLD',
  UNDERLINE = 'UNDERLINE',
  LINE_THROUGH = 'LINE_THROUGH',
  SMALL = 'SMALL',
  SUP = 'SUP',
  SUB = 'SUB',
  MONO = 'MONO',
  FOREGROUND_COLOR = 'FOREGROUND_COLOR',
  REMOVE_STYLE = 'REMOVE_STYLE',
  JUSTIFY_LEFT = 'JUSTIFY_LEFT',
  JUSTIFY_CENTER = 'JUSTIFY_CENTER',
  JUSTIFY_RIGHT = 'JUSTIFY_RIGHT',
  JUSTIFY_FILL = 'JUSTIFY_FILL',
  BACKGROUND_COLOR = 'BACKGROUND_COLOR',
  CREATE_TEST_SAMPLE = 'CREATE_TEST_SAMPLE',
  TOGGLE_BULLET_POINT = 'TOGGLE_BULLET_POINT',
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  UNDO = 'UNDO',
  REDO = 'REDO',
  MOVE_LINE_DOWN = 'MOVE_LINE_DOWN',
  MOVE_LINE_UP = 'MOVE_LINE_UP',
  DELETE_LINE = 'DELETE_LINE',
  INSERT_ANCHOR = 'INSERT_ANCHOR',
  INSERT_LINK = 'INSERT_LINK',
}
registerEnumType(HotKeyActionType, {
  name: 'HotKeyActionType',
});

@InputType('HotKeyIt')
@ObjectType('HotKey')
export class HotKey {
  @Field(() => HotKeyActionType)
  type: HotKeyActionType;
  @Field({ nullable: true })
  keys?: string;
}
