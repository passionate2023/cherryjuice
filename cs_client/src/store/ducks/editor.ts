import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { rootActionCreators } from './root';
import { cloneObj } from '::helpers/editing/execK/helpers';

const ap = createActionPrefixer('editor');

const ac = {
  showTree: _(ap('showTree')),
  hideTree: _(ap('hideTree')),
  toggleTree: _(ap('toggleTree')),
  toggleFormattingBar: _(ap('toggle-formatting-bar')),
  toggleRecentNodesBar: _(ap('toggle-recent-nodes-bar')),
  toggleInfoBar: _(ap('toggle-info-bar')),
  setTreeWidth: _(ap('set-tree-width'), _ => (width: number) => _(width)),
};

type State = {
  showTree: boolean;
  showFormattingButtons: boolean;
  contentEditable: boolean;
  showRecentNodesBar: boolean;
  showInfoBar: boolean;
  treeWidth: number;
};

const initialState: State = {
  showTree: true,
  contentEditable: true,
  showFormattingButtons: true,
  showRecentNodesBar: false,
  showInfoBar: false,
  treeWidth: 250,
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  _(ac.showTree, state => ({ ...state, showTree: true })),
  _(rootActionCreators.hidePopups, state => ({ ...state, showInfoBar: false })),
  _(ac.hideTree, state => ({ ...state, showTree: false })),
  _(ac.toggleTree, state => ({ ...state, showTree: !state.showTree })),
  _(ac.toggleRecentNodesBar, state => ({
    ...state,
    showRecentNodesBar: !state.showRecentNodesBar,
  })),
  _(ac.toggleFormattingBar, state => ({
    ...state,
    showFormattingButtons: !state.showFormattingButtons,
    contentEditable: !state.showFormattingButtons,
  })),
  _(ac.toggleInfoBar, state => ({
    ...state,
    showInfoBar: !state.showInfoBar,
  })),
  _(ac.setTreeWidth, (state, { payload }) => ({
    ...state,
    treeWidth: payload,
  })),
]);

export { reducer as editorReducer, ac as editorActionCreators };
