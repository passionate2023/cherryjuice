import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from '../../helpers/shared';
import { authActionCreators } from '::store/ducks/auth';
import produce from 'immer';
import {
  toggleMetaKey,
  ToggleMetaKeyProps,
} from '::store/ducks/settings/hotkeys-settings/reducers/toggle-meta';
import {
  setKey,
  SetKeyProps,
} from '::store/ducks/settings/hotkeys-settings/reducers/set-key';
import { resetToDefault } from '::store/ducks/settings/hotkeys-settings/reducers/reset-to-default';
import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { calculateDuplicates } from '::store/ducks/settings/hotkeys-settings/reducers/calculate-duplicates';

export type HotKeyDict = { [key in HotKeyActionType]?: string };
const ap = createActionPrefixer('hotkeys-settings');

const ac = {
  //
  undoChanges: _(ap('undo-changes')),
  setKey: _(ap('set-key'), _ => (key: SetKeyProps) => _(key)),
  toggleMeta: _(ap('toggle-meta'), _ => (payload: ToggleMetaKeyProps) =>
    _(payload),
  ),
  resetToDefaults: _(ap('reset-to-defaults')),
  calculateDuplicates: _(ap('calculate-duplicates')),
};

type State = {
  current: HotKeyDict;
  previous: HotKeyDict;
  duplicates: HotKeyDict;
};

const initialState: State = {
  duplicates: {},
  current: {},
  previous: undefined,
};
const reducer = createReducer(initialState, _ => [
  _(authActionCreators.setAuthenticationSucceeded, (state, { payload }) => {
    delete payload.settings.hotKeys['__typename'];
    Object.values(payload.settings.hotKeys).forEach(hks => {
      hks.forEach(object => {
        delete object['__typename'];
      });
    });
    return {
      previous: undefined,
      duplicates: undefined,
      current: Object.fromEntries([
        ...payload.settings.hotKeys.formatting.map(hk => [hk.type, hk.keys]),
        ...payload.settings.hotKeys.general.map(hk => [hk.type, hk.keys]),
      ]),
    };
  }),

  _(ac.toggleMeta, (state, { payload }) =>
    produce(state, draft => toggleMetaKey(draft, payload)),
  ),
  _(ac.setKey, (state, { payload }) =>
    produce(state, draft => setKey(draft, payload)),
  ),
  _(ac.undoChanges, state =>
    produce(state, draft => {
      draft.current = draft.previous || draft.current;
      draft.previous = undefined;
      draft.duplicates = undefined;
      return draft;
    }),
  ),
  _(ac.resetToDefaults, state =>
    produce(state, draft => resetToDefault(draft)),
  ),
  _(ac.calculateDuplicates, state =>
    produce(state, draft => calculateDuplicates(draft)),
  ),
]);

export { reducer as hotkeysSettingsReducer, ac as hotkeysSettingsACs };
export { State as HotkeysSettingsState };
