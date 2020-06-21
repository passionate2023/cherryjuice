import { helpers } from './helpers';

type HotKeyKeys = {
  key?: string;
  code?: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

type HotKey = {
  hotKey: HotKeyKeys;
  callback: Function;
  options?: {
    richTextHasToBeOnFocus: boolean;
  };
};
const createHotKeysManeger = () => {
  const hotKeys: HotKey[] = [];

  const createHotKey = ({
    callback,
    hotKey,
    options = { richTextHasToBeOnFocus: true },
  }: HotKey) => {
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
        options,
      });
  };
  const eventHandler = (e: KeyboardEvent) => {
    for (const {
      hotKey,
      callback,
      options: { richTextHasToBeOnFocus },
    } of hotKeys) {
      if (helpers.hotKeyMatches(e, hotKey)) {
        if (
          !richTextHasToBeOnFocus ||
          (helpers.richTextIsOnFocus(e) && richTextHasToBeOnFocus)
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

  return { startListening, stopListening, createHotKey };
};
const hotKeysManager = createHotKeysManeger();

export { hotKeysManager };
export { HotKey, HotKeyKeys };
