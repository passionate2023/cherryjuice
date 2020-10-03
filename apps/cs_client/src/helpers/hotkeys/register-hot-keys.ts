import { execK } from '::helpers/editing/execK';
import { createTestSample } from '::helpers/editing/execK/__tests__/__helpers__/create-test-sample';
import { hotKeysManager, HotKeyTarget } from './hotkeys-manager';
import { generalHotKeysProps } from '::helpers/hotkeys/hot-key-props.ts/general-hotkeys-props';
import { formattingHotkeysProps } from '::helpers/hotkeys/hot-key-props.ts/formatting-props';
import { HotKey, HotKeyActionType } from '::types/graphql';
import { flattenHotKey } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/helpers/flatten-hot-key';

const registerFormattingHKs = (hotKeys: HotKey[] = []) => {
  hotKeys
    .filter(hotKey => hotKey.keys)
    .forEach(({ keys, type }) => {
      const colorCommands =
        type === HotKeyActionType.FG_COLOR ||
        type === HotKeyActionType.BG_COLOR;
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

const registerGeneralHKs = (hotKeys: HotKey[] = []) => {
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

const registerDevHKs = () => {
  hotKeysManager.registerHotKey({
    keys: flattenHotKey({ key: '¤', ctrlKey: true, altKey: true }),
    callback: createTestSample,
    options: { target: HotKeyTarget.GLOBAL },
    type: HotKeyActionType.CREATE_TEST_SAMPLE,
  });
};

export { registerDevHKs, registerFormattingHKs, registerGeneralHKs };
