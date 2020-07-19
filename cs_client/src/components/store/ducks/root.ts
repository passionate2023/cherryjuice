import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';

const ap = createActionPrefixer('root');

const ac = {
  resetState: _(ap('reset-state')),
  hidePopups: _(ap('hide-popups')),
  ...{
    setIsOnMobile: _(ap('set-is-on-mobile'), _ => (isOnMobile: boolean) =>
      _(isOnMobile),
    ),
  },
  toggleDockedDialog: _(ap('toggle-docked-dialog')),
};

type State = {
  isOnMobile: boolean;
  dockedDialog: boolean;
};

const initialState: State = {
  isOnMobile: false,
  dockedDialog: true,
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(ac.setIsOnMobile, (state, { payload }) => ({
      ...state,
      isOnMobile: payload,
    })),
    _(ac.toggleDockedDialog, state => ({
      ...state,
      dockedDialog: !state.dockedDialog,
    })),
  ],
]);

export { reducer as rootReducer, ac as rootActionCreators };
export { State as RootReducerState };
