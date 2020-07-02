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
};

type State = {
  isOnMobile: boolean;
};

const initialState: State = {
  isOnMobile: false,
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(ac.setIsOnMobile, (state, { payload }) => ({
      ...state,
      isOnMobile: payload,
    })),
  ],
]);

export { reducer as rootReducer, ac as rootActionCreators };
