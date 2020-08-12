import { execK } from '::helpers/editing/execK';
import { createTestSample } from '::helpers/editing/execK/__tests__/__helpers__/create-test-sample';
import { HotKey, hotKeysManager, HotKeyTarget } from './hotkeys-manager';
import { documentHotkeysProps } from '::helpers/hotkeys/hot-key-props.ts/document-props';
import { formattingHotkeysProps } from '::helpers/hotkeys/hot-key-props.ts/formatting-props';
import { HotKeyActionType } from '::helpers/hotkeys/types';

const registerFormattingHKs = (hotKeys: HotKey[] = []) => {
  hotKeys
    .filter(hotKey => hotKey.keysCombination)
    .forEach(({ keysCombination, type }) => {
      if (
        type === HotKeyActionType.FG_COLOR ||
        type === HotKeyActionType.BG_COLOR
      )
        hotKeysManager.registerHotKey({
          type,
          keysCombination: keysCombination,
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
          keysCombination: keysCombination,
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
    .filter(hotKey => hotKey.keysCombination)
    .forEach(({ keysCombination, type }) => {
      hotKeysManager.registerHotKey({
        type,
        keysCombination: keysCombination,
        callback: documentHotkeysProps[type],
        options: { target: HotKeyTarget.GLOBAL },
      });
    });
};

const registerDevHKs = () => {
  hotKeysManager.registerHotKey({
    keysCombination: { key: '¤', ctrlKey: true, altKey: true },
    callback: createTestSample,
    options: { target: HotKeyTarget.GLOBAL },
    type: HotKeyActionType.CREATE_TEST_SAMPLE,
  });
};

export { registerDevHKs, registerFormattingHKs, registerDocumentHKs };
