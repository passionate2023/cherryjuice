import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { screens } from '::app/menus/settings/screens';
import { AsyncOperation } from '::root/store/ducks/document';
import { UpdateUserProfileIt } from '::types/graphql/generated';

const ap = createActionPrefixer('settings');

const ac = {
  ...{
    selectScreen: _(ap('set-screen'), _ => (screenName: string) =>
      _(screenName),
    ),
  },
  ...{
    save: _(ap('save'), _ => (nextScreen?: string) => _(nextScreen)),
    saveStarted: _(ap('save-started')),
    saveFulfilled: _(ap('save-fulfilled')),
    saveFailed: _(ap('save-failed')),
  },
  ...{
    setUserProfileChanges: _(
      ap('set-user-profile-changes'),
      _ => (changes: UpdateUserProfileIt) => _(changes),
    ),
    clearUserProfileChanges: _(ap('clear-user-profile-changes')),
  },
};

type State = {
  selectedScreen: string;
  screenHasChanges: boolean;
  saveOperation: AsyncOperation;
  userProfileChanges: UpdateUserProfileIt;
  nextScreen?: string;
};

const initialState: State = {
  selectedScreen: Object.keys(screens)[0],
  screenHasChanges: false,
  saveOperation: 'idle',
  userProfileChanges: undefined,
  nextScreen: undefined,
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(ac.selectScreen, (state, { payload }) => ({
      ...state,
      selectedScreen: payload,
      screenHasChanges: false,
    })),
  ],
  ...[
    _(ac.setUserProfileChanges, (state, { payload }) => ({
      ...state,
      screenHasChanges: true,
      userProfileChanges: payload,
    })),
    _(
      ac.clearUserProfileChanges,
      state =>
        ({
          ...state,
          screenHasChanges: false,
          userProfileChanges: undefined,
        } as State),
    ),
  ],
  ...[
    _(ac.save, (state, { payload }) => ({
      ...state,
      saveOperation: 'pending',
      nextScreen: payload,
    })),
    _(ac.saveStarted, state => ({
      ...state,
      saveOperation: 'in-progress',
    })),
    _(
      ac.saveFulfilled,
      state =>
        ({
          ...state,
          saveOperation: 'idle',
          screenHasChanges: false,
          userProfileChanges: undefined,
          selectedScreen: state.nextScreen || state.selectedScreen,
        } as State),
    ),
    _(ac.saveFailed, state => ({
      ...state,
      saveOperation: 'idle',
    })),
  ],
]);

export { reducer as settingsReducer, ac as settingsActionCreators };
