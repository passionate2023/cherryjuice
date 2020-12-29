import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/objects';

const ap = createActionPrefixer('root');

const ac = {
  resetState: _(ap('reset-state')),
  hidePopups: _(ap('hide-popups')),
  setIsOnMd: _(ap('set-is-on-md'), _ => (b: boolean) => _(b)),
  setIsOnMb: _(ap('set-is-on-mb'), _ => (b: boolean) => _(b)),
  setDocking: _(ap('set-docking'), _ => (b: boolean) => _(b)),
  setNetworkStatus: _(ap('set-network-status'), _ => (b: boolean) => _(b)),
  toggleDockedDialog: _(ap('toggle-docked-dialog')),
};

type State = {
  isOnMb: boolean;
  isOnMd: boolean;
  dockedDialog: boolean;
  docking: boolean;
  online: boolean;
};

const initialState: State = {
  isOnMb: false,
  isOnMd: false,
  dockedDialog: false,
  docking: false,
  online: true,
};
const reducer = createReducer(initialState, _ => [
  _(ac.resetState, () => cloneObj(initialState)),
  ...[
    _(ac.setIsOnMb, (state, { payload }) => ({
      ...state,
      isOnMb: payload,
    })),
    _(ac.setIsOnMd, (state, { payload }) => ({
      ...state,
      isOnMd: payload,
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
  ],
]);

export { reducer as rootReducer, ac as rootActionCreators };
export { State as RootReducerState };
