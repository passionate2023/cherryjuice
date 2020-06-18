import { execK } from '::helpers/editing/execK';
import { createTestSample } from '::helpers/editing/execK/__tests__/__helpers__/create-test-sample';
import { formattingHotKeys } from '../combinations/formatting';
import { hotKeysManager } from './hotkeys-manager';
import { documentHotKeys } from '../combinations/document';

const setupFormattingHotKeys = () => {
  [...formattingHotKeys.tagsAndStyles, ...formattingHotKeys.misc].forEach(
    ({ hotKey, execCommandArguments }) => {
      if (hotKey)
        hotKeysManager.createHotKey({
          hotKey,
          callback: () => execK({ ...execCommandArguments }),
        });
    },
  );
  formattingHotKeys.colors.forEach(({ hotKey, inputId }) => {
    hotKeysManager.createHotKey({
      hotKey,
      callback: () => {
        (document.querySelector(`#${inputId}`) as HTMLInputElement).click();
      },
    });
  });
};

const setupDocumentHotKeys = () => {
  documentHotKeys.forEach(hotKeysManager.createHotKey);
};

const setupDevHotKeys = () => {
  hotKeysManager.createHotKey({
    hotKey: { key: '¤', ctrlKey: true, altKey: true },
    callback: createTestSample,
  });
};

export { setupDevHotKeys, setupFormattingHotKeys, setupDocumentHotKeys };
