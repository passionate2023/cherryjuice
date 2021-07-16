import { HotKey, HotKeyActionType } from '@cherryjuice/graphql-types';
import { pagesManager } from '@cherryjuice/editor';
import { hotKeysManager, HotKeyTarget } from '@cherryjuice/hotkeys';

const generalHotKeysProps = {
  [HotKeyActionType.UNDO]: () => {
    if (document.activeElement.id === 'rich-text') pagesManager.current.undo();
  },
  [HotKeyActionType.REDO]: () => {
    if (document.activeElement.id === 'rich-text') pagesManager.current.redo();
  },
};

export const registerGeneralHKs = (hotKeys: HotKey[] = []) => {
  hotKeys
    .filter(hotKey => hotKey.keys && generalHotKeysProps[hotKey.type])
    .forEach(({ keys, type }) => {
      hotKeysManager.registerHotKey({
        type,
        keys: keys,
        callback: generalHotKeysProps[type],
        options: { target: HotKeyTarget.GLOBAL },
      });
    });
};
