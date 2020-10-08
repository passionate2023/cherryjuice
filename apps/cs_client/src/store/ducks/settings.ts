import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  ScreenName,
  screens,
} from '::root/components/app/components/menus/dialogs/settings/screens/screens';
import { AsyncOperation } from './document';
import { UpdateUserProfileIt } from '@cherryjuice/graphql-types';
import { dialogsActionCreators } from './dialogs';

const ap = createActionPrefixer('settings');

const ac = {
  ...{
    selectScreen: _(ap('set-screen'), _ => (screenName: ScreenName) =>
      _(screenName),
    ),
  },
  ...{
    save: _(ap('save'), _ => (nextScreen?: ScreenName) => _(nextScreen)),
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
  selectedScreen: ScreenName;
  saveOperation: AsyncOperation;
  userProfileChanges: UpdateUserProfileIt;
  nextScreen?: string;
};

const initialState: State = {
  selectedScreen: Object.keys(screens)[0] as ScreenName,
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
      userProfileChanges: payload,
    })),
    _(
      ac.clearUserProfileChanges,
      state =>
        ({
          ...state,
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
    _(dialogsActionCreators.hidePasswordModal, state => ({
      ...state,
      saveOperation: 'idle',
    })),
  ],
]);

export { reducer as settingsReducer, ac as settingsActionCreators };
