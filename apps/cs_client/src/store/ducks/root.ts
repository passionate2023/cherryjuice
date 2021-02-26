import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/objects';
import { Breakpoint } from '@cherryjuice/shared-helpers';

const ap = createActionPrefixer('root');

const ac = {
  resetState: _(ap('reset-state')),
  hidePopups: _(ap('hide-popups')),
  setDocking: _(ap('set-docking'), _ => (b: boolean) => _(b)),
  setNetworkStatus: _(ap('set-network-status'), _ => (b: boolean) => _(b)),
  toggleDockedDialog: _(ap('toggle-docked-dialog')),
  toggleTheme: _(ap('toggle-theme')),
  setBreakpoint: _(ap('set-breakpoint'), _ => (breakpoint: Breakpoint) =>
    _(breakpoint),
  ),
};

type State = {
  dockedDialog: boolean;
  docking: boolean;
  online: boolean;
  theme: 'light' | 'dark';
  breakpoint: Breakpoint;
};

const defaultBreakpoint = {
  mb: false,
  tb: false,
  mbOrTb: false,
  md: true,
  wd: false,
};

const initialState: State = {
  dockedDialog: false,
  docking: false,
  online: true,
  theme: 'light',
  breakpoint: { ...defaultBreakpoint },
};
const reducer = createReducer(initialState, _ => [
  _(ac.resetState, () => ({
    ...cloneObj(initialState),
    breakpoint: { ...defaultBreakpoint },
  })),
  ...[
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
    _(ac.setBreakpoint, (state, { payload }) => ({
      ...state,
      breakpoint: payload,
    })),
  ],
]);

export { reducer as rootReducer, ac as rootActionCreators };
export { State as RootReducerState };
