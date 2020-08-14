import { execK } from '::helpers/editing/execK';
import { createTestSample } from '::helpers/editing/execK/__tests__/__helpers__/create-test-sample';
import { HotKey, hotKeysManager, HotKeyTarget } from './hotkeys-manager';
import { documentHotkeysProps } from '::helpers/hotkeys/hot-key-props.ts/document-props';
import { formattingHotkeysProps } from '::helpers/hotkeys/hot-key-props.ts/formatting-props';
import { HotKeyActionType } from '::helpers/hotkeys/types';
import { flattenHotKey } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/helpers/flatten-hot-key';

const registerFormattingHKs = (hotKeys: HotKey[] = []) => {
  hotKeys
    .filter(hotKey => hotKey.keys)
    .forEach(({ keys, type }) => {
      if (
        type === HotKeyActionType.FG_COLOR ||
        type === HotKeyActionType.BG_COLOR
      )
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
      else
        hotKeysManager.registerHotKey({
          type,
          keys: keys,
          callback: () =>
            execK(formattingHotkeysProps[type].execCommandArguments),
          options: {
            target: HotKeyTarget.RICH_TEXT,
          },
        });
    });
};

const registerDocumentHKs = (hotKeys: HotKey[] = []) => {
  hotKeys
    .filter(hotKey => hotKey.keys)
    .forEach(({ keys, type }) => {
      hotKeysManager.registerHotKey({
        type,
        keys: keys,
        callback: documentHotkeysProps[type],
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

export { registerDevHKs, registerFormattingHKs, registerDocumentHKs };
