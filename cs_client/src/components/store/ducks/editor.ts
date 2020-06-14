import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';

const ap = createActionPrefixer('editor');

const ac = {
  showTree: _(ap('showTree')),
  hideTree: _(ap('hideTree')),
  toggleTree: _(ap('toggleTree')),
};

type State = {
  showTree: boolean;
};

const initialState: State = {
  showTree: true,
};
const reducer = createReducer(initialState, _ => [
  _(ac.showTree, state => ({ ...state, showTree: true })),
  _(ac.hideTree, state => ({ ...state, showTree: false })),
  _(ac.toggleTree, state => ({ ...state, showTree: !state.showTree })),
]);

export { reducer as editorReducer, ac as editorActionCreators };
