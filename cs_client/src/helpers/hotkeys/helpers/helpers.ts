import { HotKeyKeys } from './hotkeys-manager';

const helpers = {
  nameMe: (hotKey: HotKeyKeys) => ({
    ...(hotKey.key ? { key: hotKey.key } : { code: hotKey.code }),
    ctrlKey: Boolean(hotKey.ctrlKey),
    shiftKey: Boolean(hotKey.shiftKey),
    altKey: Boolean(hotKey.altKey),
    metaKey: Boolean(hotKey.metaKey),
  }),
  hotKeyMatches: (e: KeyboardEvent | HotKeyKeys, b: HotKeyKeys) =>
    (b.key ? b.key === e.key : b.code === e.code) &&
    b.ctrlKey === e.ctrlKey &&
    b.shiftKey === e.shiftKey &&
    b.altKey === e.altKey &&
    b.metaKey === e.metaKey,
  richTextIsOnFocus: e => e.target.getAttribute('id') === 'rich-text',
};

export { helpers };
