import { HotKeyActionType } from '../hot-key.entity';
import { HotKeys } from '../hot-keys.entity';

export const getDefaultHotkeys = (): HotKeys => ({
  formatting: [
    { type: HotKeyActionType.BOLD, keys: 'b100' },
    { type: HotKeyActionType.ITALIC, keys: 'i100' },
    { type: HotKeyActionType.UNDERLINE, keys: ' 100' },
    { type: HotKeyActionType.LINE_THROUGH, keys: 'e100' },
    { type: HotKeyActionType.H1, keys: '1100' },
    { type: HotKeyActionType.H2, keys: '2100' },
    { type: HotKeyActionType.H3, keys: '3100' },
    { type: HotKeyActionType.SMALL, keys: '0100' },
    { type: HotKeyActionType.SUP, keys: 'arrowup100' },
    { type: HotKeyActionType.SUB, keys: 'arrowdown100' },
    { type: HotKeyActionType.MONO, keys: 'm100' },
    { type: HotKeyActionType.JUSTIFY_LEFT, keys: undefined },
    { type: HotKeyActionType.JUSTIFY_CENTER, keys: undefined },
    { type: HotKeyActionType.JUSTIFY_RIGHT, keys: undefined },
    { type: HotKeyActionType.JUSTIFY_FILL, keys: undefined },
    { type: HotKeyActionType.FG_COLOR, keys: ' 101' },
    { type: HotKeyActionType.BG_COLOR, keys: ' 110' },
    { type: HotKeyActionType.REMOVE_STYLE, keys: 'r010' },
    { type: HotKeyActionType.DELETE_LINE, keys: 'k100' },
    { type: HotKeyActionType.MOVE_LINE_UP, keys: 'arrowup010' },
    { type: HotKeyActionType.MOVE_LINE_DOWN, keys: 'arrowdown010' },
  ],
  general: [
    { type: HotKeyActionType.INSERT_LINK, keys: 'l100' },
    { type: HotKeyActionType.INSERT_ANCHOR, keys: 'a110' },
    { type: HotKeyActionType.SAVE_DOCUMENT, keys: 's100' },
    { type: HotKeyActionType.UNDO, keys: 'z100' },
    { type: HotKeyActionType.REDO, keys: 'z101' },
    { type: HotKeyActionType.RELOAD_DOCUMENT, keys: 'r100' },
    { type: HotKeyActionType.SHOW_DOCUMENTS_LIST, keys: 'o100' },
    { type: HotKeyActionType.SHOW_IMPORT_DOCUMENTS, keys: 'i010' },
    { type: HotKeyActionType.SHOW_CREATE_DOCUMENT, keys: 'n110' },
    {
      type: HotKeyActionType.SHOW_CREATE_SIBLING_NODE,
      keys: 'n010',
    },
  ],
});
