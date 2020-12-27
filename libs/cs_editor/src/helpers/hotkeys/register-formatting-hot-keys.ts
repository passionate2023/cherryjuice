import { HotKey, HotKeyActionType } from '@cherryjuice/graphql-types';
import { hotKeysManager, HotKeyTarget } from '@cherryjuice/hotkeys';
import { formattingHotkeysProps } from '::helpers/hotkeys/props/formatting-props';
import { execK } from '::helpers/execK';

export const registerFormattingHKs = (hotKeys: HotKey[] = []) => {
  hotKeys
    .filter(hotKey => hotKey.keys)
    .forEach(({ keys, type }) => {
      const colorCommands =
        type === HotKeyActionType.FOREGROUND_COLOR ||
        type === HotKeyActionType.BACKGROUND_COLOR;
      if (colorCommands)
        hotKeysManager.registerHotKey({
          type,
          keys: keys,
          callback: () => {
            (document.querySelector(`#${type}`) as HTMLInputElement).click();
          },
          options: {
            target: HotKeyTarget.RICH_TEXT,
          },
        });
      else {
        const hotkeysProp = formattingHotkeysProps[type];
        const callback =
          'execCommandArguments' in hotkeysProp
            ? () => execK(hotkeysProp.execCommandArguments)
            : hotkeysProp.callback;
        hotKeysManager.registerHotKey({
          type,
          keys: keys,
          callback,
          options: {
            target: HotKeyTarget.RICH_TEXT,
          },
        });
      }
    });
};
