import { HotKey } from '@cherryjuice/graphql-types';
import { hotKeysManager, HotKeyTarget } from '@cherryjuice/hotkeys';
import { generalHotKeysProps } from '::helpers/hotkeys/props/general-hotkeys-props';

export const registerGeneralHKs = (hotKeys: HotKey[] = []) => {
  hotKeys
    .filter(hotKey => hotKey.keys)
    .forEach(({ keys, type }) => {
      hotKeysManager.registerHotKey({
        type,
        keys: keys,
        callback: generalHotKeysProps[type],
        options: { target: HotKeyTarget.GLOBAL },
      });
    });
};
