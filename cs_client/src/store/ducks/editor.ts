import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { rootActionCreators } from './root';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { dialogsActionCreators } from '::store/ducks/dialogs';
import { CustomRange, getSelection } from '::helpers/editing/execK/steps/get-selection';

const ap = createActionPrefixer('editor');

const ac = {
  showTree: _(ap('showTree')),
  hideTree: _(ap('hideTree')),
  toggleTree: _(ap('toggleTree')),
  toggleFormattingBar: _(ap('toggle-formatting-bar')),
  toggleRecentNodesBar: _(ap('toggle-recent-nodes-bar')),
  toggleInfoBar: _(ap('toggle-info-bar')),
  setTreeWidth: _(ap('set-tree-width'), _ => (width: number) => _(width)),
  setAnchorId: _(ap('set-anchor-id'), _ => (id: string) => _(id)),
  setSelectedLink: _(ap('set-selected-link'), _ => (link: string) => _(link)),
};

type State = {
  showTree: boolean;
  showFormattingButtons: boolean;
  contentEditable: boolean;
  showRecentNodesBar: boolean;
  showInfoBar: boolean;
  treeWidth: number;
  anchorId?: string;
  selectedLink?: string;
  selection?: CustomRange;
};

const initialState: State = {
  showTree: true,
  contentEditable: true,
  showFormattingButtons: true,
  showRecentNodesBar: false,
  showInfoBar: false,
  treeWidth: 250,
  anchorId: undefined,
  selectedLink: undefined,
  selection: undefined,
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
  _(ac.setAnchorId, (state, { payload }) => ({
    ...state,
    anchorId: payload,
  })),
  _(dialogsActionCreators.hideAnchorDialog, state => ({
    ...state,
    anchorId: undefined,
  })),
  _(ac.setSelectedLink, (state, { payload }) => ({
    ...state,
    selectedLink: payload,
  })),
  _(dialogsActionCreators.hideLinkDialog, state => ({
    ...state,
    selectedLink: undefined,
  })),
  _(dialogsActionCreators.showAnchorDialog, state => ({
    ...state,
    selection: getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    }),
  })),

  _(dialogsActionCreators.showLinkDialog, state => ({
    ...state,
    selection: getSelection({
      selectAdjacentWordIfNoneIsSelected: true,
    }),
  })),
]);

export { reducer as editorReducer, ac as editorActionCreators };
