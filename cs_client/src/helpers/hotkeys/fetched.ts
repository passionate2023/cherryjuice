import { HotKey, HotKeyTarget } from '::helpers/hotkeys/hotkeys-manager';
import { HotKeyActionType } from '::helpers/hotkeys/types';

export type HotKeyCategoryMeta = {
  name: HotKeyCategory;
  target: HotKeyTarget;
};

type HotKeyCategory = 'formatting' | 'document';

export type UserHotkeys = {
  [category in HotKeyCategory]: {
    meta: HotKeyCategoryMeta;
    hotkeys: HotKey[];
  };
};

export const userHotkeys: UserHotkeys = {
  formatting: {
    meta: {
      name: 'formatting',
      target: HotKeyTarget.RICH_TEXT,
    },
    hotkeys: [
      {
        type: HotKeyActionType.BOLD,
        keysCombination: { key: 'b', ctrlKey: true },
      },
      {
        type: HotKeyActionType.ITALIC,
        keysCombination: { key: 'i', ctrlKey: true },
      },
      {
        type: HotKeyActionType.UNDERLINE,
        keysCombination: { key: ' ', ctrlKey: true },
      },
      {
        type: HotKeyActionType.LINE_THROUGH,
        keysCombination: { key: 'e', ctrlKey: true },
      },
      {
        keysCombination: { key: '1', ctrlKey: true },
        type: HotKeyActionType.H1,
      },
      {
        keysCombination: { key: `2`, ctrlKey: true },
        type: HotKeyActionType.H2,
      },
      {
        keysCombination: { key: `3`, ctrlKey: true },
        type: HotKeyActionType.H3,
      },
      {
        type: HotKeyActionType.SMALL,
        keysCombination: { key: `0`, ctrlKey: true },
      },
      {
        type: HotKeyActionType.SUP,
        keysCombination: { key: `ArrowUp`, ctrlKey: true },
      },
      {
        type: HotKeyActionType.SUB,
        keysCombination: { key: `ArrowDown`, ctrlKey: true },
      },
      {
        type: HotKeyActionType.MONO,
        keysCombination: { key: `m`, ctrlKey: true },
      },
      {
        type: HotKeyActionType.JUSTIFY_LEFT,
      },
      { type: HotKeyActionType.JUSTIFY_CENTER },
      { type: HotKeyActionType.JUSTIFY_RIGHT },
      { type: HotKeyActionType.JUSTIFY_FILL },
      {
        type: HotKeyActionType.FG_COLOR,
        keysCombination: { key: ' ', ctrlKey: true, shiftKey: true },
      },
      {
        type: HotKeyActionType.BG_COLOR,
        keysCombination: { key: ' ', ctrlKey: true, altKey: true },
      },
      {
        type: HotKeyActionType.REMOVE_STYLE,
        keysCombination: { key: `r`, altKey: true },
      },
    ],
  },
  document: {
    meta: {
      name: 'document',
      target: HotKeyTarget.GLOBAL,
    },
    hotkeys: [
      {
        keysCombination: { key: 's', ctrlKey: true },
        type: HotKeyActionType.SAVE_DOCUMENT,
      },
      {
        keysCombination: { key: 'r', ctrlKey: true },
        type: HotKeyActionType.RELOAD_DOCUMENT,
      },
      {
        keysCombination: { key: 'o', ctrlKey: true },
        type: HotKeyActionType.SHOW_DOCUMENTS_LIST,
      },
      {
        keysCombination: { key: 'i', altKey: true },
        type: HotKeyActionType.SHOW_IMPORT_DOCUMENTS,
      },
      {
        keysCombination: { key: 'n', ctrlKey: true, altKey: true },
        type: HotKeyActionType.SHOW_CREATE_DOCUMENT,
      },
      {
        keysCombination: { key: 'n', altKey: true },
        type: HotKeyActionType.SHOW_CREATE_SIBLING_NODE,
      },
    ],
  },
};
