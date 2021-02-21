import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/objects';

const ap = createActionPrefixer('root');

const ac = {
  resetState: _(ap('reset-state')),
  hidePopups: _(ap('hide-popups')),
  setIsOnWd: _(ap('set-is-on-wd'), _ => (b: boolean) => _(b)),
  setIsOnTb: _(ap('set-is-on-tb'), _ => (b: boolean) => _(b)),
  setIsOnMb: _(ap('set-is-on-mb'), _ => (b: boolean) => _(b)),
  setDocking: _(ap('set-docking'), _ => (b: boolean) => _(b)),
  setNetworkStatus: _(ap('set-network-status'), _ => (b: boolean) => _(b)),
  toggleDockedDialog: _(ap('toggle-docked-dialog')),
  toggleTheme: _(ap('toggle-theme')),
};

type State = {
  isOnMb: boolean;
  isOnTb: boolean;
  isOnWd: boolean;
  dockedDialog: boolean;
  docking: boolean;
  online: boolean;
  theme: 'light' | 'dark';
};

const initialState: State = {
  isOnMb: false,
  isOnTb: false,
  isOnWd: false,
  dockedDialog: false,
  docking: false,
  online: true,
  theme: 'light',
};
const reducer = createReducer(initialState, _ => [
  _(ac.resetState, state => ({
    ...cloneObj(initialState),
    isOnMb: state.isOnMb,
    isOnTb: state.isOnTb,
  })),
  ...[
    _(ac.setIsOnMb, (state, { payload }) => ({
      ...state,
      isOnMb: payload,
    })),
    _(ac.setIsOnTb, (state, { payload }) => ({
      ...state,
      isOnTb: payload,
    })),
    _(ac.setIsOnWd, (state, { payload }) => ({
      ...state,
      isOnWd: payload,
    })),
    _(ac.setDocking, (state, { payload }) => ({
      ...state,
      docking: payload,
    })),
    _(ac.toggleDockedDialog, state => ({
      ...state,
      dockedDialog: !state.dockedDialog,
    })),
    _(ac.setNetworkStatus, (state, { payload }) => ({
      ...state,
      online: payload,
    })),
    _(ac.toggleTheme, state => ({
      ...state,
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  ],
]);

export { reducer as rootReducer, ac as rootActionCreators };
export { State as RootReducerState };
