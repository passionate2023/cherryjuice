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
    metaKey: Boolean(hotKey.metaKey)
  }),
  hotKeyMatches: (e: KeyboardEvent | THotKey, b: THotKey) =>
    (b.key ? b.key === e.key : b.code === e.code) &&
    // b.key === e.key &&
    b.ctrlKey === e.ctrlKey &&
    b.shiftKey === e.shiftKey &&
    b.altKey === e.altKey &&
    b.metaKey === e.metaKey
};
const hotKeys: { callback: Function; hotKey: THotKey }[] = [];
const createHotKey = (hotKey: THotKey, callback: Function) => {
  hotKey = helpers.nameMe(hotKey);
  const existingHotKeyIndex = hotKeys.findIndex(hk =>
    helpers.hotKeyMatches(hk.hotKey, hotKey)
  );
  if (existingHotKeyIndex >= 0)
    hotKeys[existingHotKeyIndex].callback = callback;
  else
    hotKeys.push({
      hotKey,
      callback
    });
};

const eventHandler = (e: KeyboardEvent) => {
  for (const { hotKey, callback } of hotKeys) {
    if (helpers.hotKeyMatches(e, hotKey)) {
      e.preventDefault();
      callback();
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

export { hotKeysManager };
export { THotKey };
