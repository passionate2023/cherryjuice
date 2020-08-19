import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from '../helpers/shared';
import { HotKeyDict } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';
import { authActionCreators } from '::store/ducks/auth';

const ap = createActionPrefixer('cache');

const ac = {
  updateHotkeys: _(
    ap('update-hotkeys'),
    _ => (changes: HotKeyDict | undefined) => _(changes),
  ),
  clearHotkeys: _(ap('clear-hotkeys')),
  syncHotKeysWithCache: _(ap('sync-hot-keys-with-cache')),
};

type State = {
  settings: {
    hotKeys: HotKeyDict;
    syncHotKeysWithCache: number;
  };
};

const initialHotKeysChanges = {};
const initialState: State = {
  settings: {
    hotKeys: initialHotKeysChanges,
    syncHotKeysWithCache: undefined,
  },
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(authActionCreators.setAuthenticationSucceeded, state => ({
      ...state,
      settings: {
        ...state.settings,
        hotKeys: initialHotKeysChanges,
      },
    })),
    _(ac.updateHotkeys, (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        hotKeys: {
          ...state.settings.hotKeys,
          ...payload,
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
  ],
]);

export { reducer as cacheReducer, ac as cacheActionCreators };
