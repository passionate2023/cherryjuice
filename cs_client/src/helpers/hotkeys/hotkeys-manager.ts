import { richTextIsOnFocus } from '::helpers/hotkeys/helpers/richtext-is-focused';
import { HotKey } from '::types/graphql/generated';
import { flattenHotKey } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/helpers/flatten-hot-key';

export type KeysCombination = {
  key?: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
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
  hotKeys: { [flat: string]: RegisteredHotKey };
};

const createHotKeysManager = () => {
  const state: State = {
    hotKeys: {},
  };
  const unregisterAllHotKeys = () => {
    state.hotKeys = {};
  };
  const registerHotKey = (hotKey: RegisteredHotKey) => {
    Object.values(state.hotKeys).forEach(registerHotKey => {
      if (registerHotKey.type === hotKey.type) {
        delete state.hotKeys[registerHotKey.keys];
      }
    });
    state.hotKeys[hotKey.keys] = hotKey;
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

  return {
    startListening,
    stopListening,
    registerHotKey,
    unregisterAllHotKeys,
  };
};
const hotKeysManager = createHotKeysManager();

export { hotKeysManager };
