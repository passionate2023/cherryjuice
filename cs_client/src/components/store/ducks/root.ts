import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';

const ap = createActionPrefixer('root');

const ac = {
  resetState: _(ap('reset-state')),
};

type State = {};

const initialState: State = {};
const reducer = createReducer(initialState, () => []);

export { reducer as rootReducer, ac as rootActionCreators };
