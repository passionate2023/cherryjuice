import { HotKey, HotKeyTarget } from '::helpers/hotkeys/hotkeys-manager';
import { HotKeyActionType } from '::helpers/hotkeys/types';
import { HotKeyDict } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';

export type HotKeyCategoryMeta = {
  name: HotKeyCategory;
  target: HotKeyTarget;
};

export type HotKeyCategory = 'formatting' | 'document';

export type UserHotkeys = {
  [category in HotKeyCategory]: {
    meta: HotKeyCategoryMeta;
    hotkeys: HotKey[];
  };
};

export const hotKeysToDict = (hotKeys: HotKey[]): HotKeyDict =>
  Object.fromEntries(hotKeys.map(hk => [hk.type, hk])) as HotKeyDict;

export const userHotkeys: UserHotkeys = {
  formatting: {
    meta: {
      name: 'formatting',
      target: HotKeyTarget.RICH_TEXT,
    },
    hotkeys: [
      { type: HotKeyActionType.BOLD, keys: 'b100' },
      { type: HotKeyActionType.ITALIC, keys: 'i100' },
      { type: HotKeyActionType.UNDERLINE, keys: ' 100' },
      { type: HotKeyActionType.LINE_THROUGH, keys: 'e100' },
      { type: HotKeyActionType.H1, keys: '1100' },
      { type: HotKeyActionType.H2, keys: '2100' },
      { type: HotKeyActionType.H3, keys: '3100' },
      { type: HotKeyActionType.SMALL, keys: '0100' },
      { type: HotKeyActionType.SUP, keys: 'ArrowUp100' },
      { type: HotKeyActionType.SUB, keys: 'ArrowDown100' },
      { type: HotKeyActionType.MONO, keys: 'm100' },
      { type: HotKeyActionType.JUSTIFY_LEFT, keys: undefined },
      { type: HotKeyActionType.JUSTIFY_CENTER, keys: undefined },
      { type: HotKeyActionType.JUSTIFY_RIGHT, keys: undefined },
      { type: HotKeyActionType.JUSTIFY_FILL, keys: undefined },
      { type: HotKeyActionType.FG_COLOR, keys: ' 101' },
      { type: HotKeyActionType.BG_COLOR, keys: ' 110' },
      { type: HotKeyActionType.REMOVE_STYLE, keys: 'r010' },
    ],
  },
  document: {
    meta: {
      name: 'document',
      target: HotKeyTarget.GLOBAL,
    },
    hotkeys: [
      { type: HotKeyActionType.SAVE_DOCUMENT, keys: 's100' },
      { type: HotKeyActionType.RELOAD_DOCUMENT, keys: 'r100' },
      { type: HotKeyActionType.SHOW_DOCUMENTS_LIST, keys: 'o100' },
      { type: HotKeyActionType.SHOW_IMPORT_DOCUMENTS, keys: 'i010' },
      { type: HotKeyActionType.SHOW_CREATE_DOCUMENT, keys: 'n110' },
      {
        type: HotKeyActionType.SHOW_CREATE_SIBLING_NODE,
        keys: 'n010',
      },
    ],
  },
};
