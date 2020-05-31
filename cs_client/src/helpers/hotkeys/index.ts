import { commands } from '::helpers/hotkeys/commands';
import { execK } from '::helpers/editing/execK';
import { createTestSample } from '::helpers/editing/execK/__tests__/__helpers__/create-test-sample';
import { ac } from '::root/store/actions.types';

type THotKey = {
  key?: string;
  code?: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

const helpers = {
  nameMe: (hotKey: THotKey) => ({
    ...(hotKey.key ? { key: hotKey.key } : { code: hotKey.code }),
    ctrlKey: Boolean(hotKey.ctrlKey),
    shiftKey: Boolean(hotKey.shiftKey),
    altKey: Boolean(hotKey.altKey),
    metaKey: Boolean(hotKey.metaKey),
  }),
  hotKeyMatches: (e: KeyboardEvent | THotKey, b: THotKey) =>
    (b.key ? b.key === e.key : b.code === e.code) &&
    // b.key === e.key &&
    b.ctrlKey === e.ctrlKey &&
    b.shiftKey === e.shiftKey &&
    b.altKey === e.altKey &&
    b.metaKey === e.metaKey,
};
const hotKeys: {
  callback: Function;
  hotKey: THotKey;
  richTextHasToBeOnFocus: boolean;
}[] = [];
const createHotKey = (
  hotKey: THotKey,
  callback: Function,
  richTextHasToBeOnFocus = true,
) => {
  hotKey = helpers.nameMe(hotKey);
  const existingHotKeyIndex = hotKeys.findIndex(hk =>
    helpers.hotKeyMatches(hk.hotKey, hotKey),
  );
  if (existingHotKeyIndex >= 0)
    hotKeys[existingHotKeyIndex].callback = callback;
  else
    hotKeys.push({
      hotKey,
      callback,
      richTextHasToBeOnFocus,
    });
};
const richTextIsOnFocus = e => e.target.getAttribute('id') === 'rich-text';
const eventHandler = (e: KeyboardEvent) => {
  for (const { hotKey, callback, richTextHasToBeOnFocus } of hotKeys) {
    if (helpers.hotKeyMatches(e, hotKey)) {
      if (
        !richTextHasToBeOnFocus ||
        (richTextIsOnFocus(e) && richTextHasToBeOnFocus)
      ) {
        e.preventDefault();
        callback();
      }
      break;
    }
  }
};

const startListening = () => {
  document.addEventListener('keydown', eventHandler);
};

const stopListening = () => {
  document.removeEventListener('keydown', eventHandler);
};

const hotKeysManager = { startListening, stopListening, createHotKey };

const setupFormattingHotKeys = () => {
  commands.tagsAndStyles.forEach(({ hotKey, execCommandArguments }) => {
    if (hotKey)
      hotKeysManager.createHotKey(hotKey, () =>
        execK({ ...execCommandArguments }),
      );
  });
  commands.misc.forEach(({ hotKey, execCommandArguments }) => {
    if (hotKey)
      hotKeysManager.createHotKey(hotKey, () =>
        execK({ ...execCommandArguments }),
      );
  });
  commands.colors.forEach(({ hotKey, inputId }) => {
    hotKeysManager.createHotKey(hotKey, () => {
      // @ts-ignore
      document.querySelector(`#${inputId}`).click();
    });
  });

  hotKeysManager.createHotKey({ key: 's', ctrlKey: true }, ac.document.save);
  hotKeysManager.createHotKey(
    { key: 'r', ctrlKey: true },
    ac.document.fetchNodes,
  );
};

const setupDevHotKeys = () => {
  hotKeysManager.createHotKey(
    { key: '¤', ctrlKey: true, altKey: true },
    createTestSample,
  );
};

export { hotKeysManager, setupDevHotKeys, setupFormattingHotKeys };
export { THotKey };
