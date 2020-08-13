import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { HotKeyCategory } from '::helpers/hotkeys/fetched';
import { HotKeyDict } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';

const ap = createActionPrefixer('cache');

const ac = {
  updateHotkeys: _(
    ap('update-hotkeys'),
    _ => (changes: HotKeysChanges | undefined) => _(changes),
  ),
  clearHotkeys: _(ap('clear-hotkeys')),
  syncHotKeysWithCache: _(ap('sync-hot-keys-with-cache')),
};

export type HotKeysChanges = {
  [category in HotKeyCategory]: HotKeyDict;
};

type State = {
  settings: {
    [setting in 'hotKeys']: HotKeysChanges;
  } & {
    syncHotKeysWithCache: number;
  };
};

const initialHotKeysChanges = {
  formatting: {},
  document: {},
};
const initialState: State = {
  settings: {
    hotKeys: initialHotKeysChanges,
    syncHotKeysWithCache: undefined,
  },
};
const reducer = createReducer(initialState, _ => [
  _(ac.updateHotkeys, (state, { payload }) => ({
    ...state,
    settings: {
      ...state.settings,
      hotKeys: {
        formatting: {
          ...state.settings.hotKeys.formatting,
          ...payload.formatting,
        },
        document: {
          ...state.settings.hotKeys.document,
          ...payload.document,
        },
      },
      syncHotKeysWithCache: undefined,
    },
  })),
  _(ac.clearHotkeys, state => ({
    ...state,
    settings: {
      ...state.settings,
      hotKeys: initialHotKeysChanges,
    },
  })),
  _(ac.syncHotKeysWithCache, state => ({
    ...state,
    settings: {
      ...state.settings,
      syncHotKeysWithCache: Date.now(),
    },
  })),
]);

export { reducer as cacheReducer, ac as cacheActionCreators };
