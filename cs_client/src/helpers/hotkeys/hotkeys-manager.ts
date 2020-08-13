import { richTextIsOnFocus } from '::helpers/hotkeys/helpers/richtext-is-focused';
import { HotKeyActionType } from '::helpers/hotkeys/types';
import { flattenHotKey } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/helpers/find-duplicate';

export type KeysCombination = {
  key?: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

export type HotKey = {
  keysCombination?: KeysCombination;
  type: HotKeyActionType;
};

export enum HotKeyTarget {
  RICH_TEXT,
  GLOBAL,
}

export type HotKeyOptions = { target: HotKeyTarget };
export type RegisteredHotKey = HotKey & {
  callback: () => void;
  options: HotKeyOptions;
};

type State = {
  hotKeys: { [flay: string]: RegisteredHotKey };
};

const createHotKeysManager = () => {
  const state: State = {
    hotKeys: {},
  };

  const registerHotKey = (hotKey: RegisteredHotKey) => {
    const flat = flattenHotKey(hotKey.keysCombination);
    state.hotKeys[flat] = hotKey;
  };
  const eventHandler = (e: KeyboardEvent) => {
    const correspondingHotKey = state.hotKeys[flattenHotKey(e)];
    if (correspondingHotKey) {
      const global = correspondingHotKey.options.target === HotKeyTarget.GLOBAL;
      if (global || richTextIsOnFocus(e)) {
        e.preventDefault();
        correspondingHotKey.callback();
      }
    }
  };
  const startListening = () => {
    document.addEventListener('keydown', eventHandler);
  };

  const stopListening = () => {
    document.removeEventListener('keydown', eventHandler);
  };

  return { startListening, stopListening, registerHotKey };
};
const hotKeysManager = createHotKeysManager();

export { hotKeysManager };
