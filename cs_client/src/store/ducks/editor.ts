import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { rootActionCreators } from './root';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { dialogsActionCreators } from '::store/ducks/dialogs';
import {
  CustomRange,
  getSelection,
} from '::helpers/editing/execK/steps/get-selection';
import { LinkType } from '::root/components/app/components/menus/dialogs/link/reducer/reducer';
import { CodeboxProperties } from '::root/components/app/components/menus/dialogs/codebox/reducer/reducer';

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
  setSelectedLink: _(ap('set-selected-link'), _ => (link: Link) => _(link)),
  setSelectedCodebox: _(
    ap('set-selected-codebox'),
    _ => (object: CodeboxProperties & { target: HTMLElement }) => _(object),
  ),
};

export type Link = { href: string; type: LinkType; target: HTMLElement };
type State = {
  showTree: boolean;
  showFormattingButtons: boolean;
  contentEditable: boolean;
  showRecentNodesBar: boolean;
  showInfoBar: boolean;
  treeWidth: number;
  anchorId?: string;
  selectedLink: Link;
  selectedCodebox: CodeboxProperties;
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
  selectedCodebox: undefined,
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
  _(
    dialogsActionCreators.hideLinkDialog,
    state =>
      ({
        ...state,
        selectedLink: undefined,
      } as State),
  ),
  _(dialogsActionCreators.showAnchorDialog, state => ({
    ...state,
    selection: getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    }),
  })),

  _(dialogsActionCreators.showLinkDialog, state => ({
    ...state,
    selection: getSelection({
      selectAdjacentWordIfNoneIsSelected: !state.selectedLink,
    }),
  })),
  _(dialogsActionCreators.showCodeboxDialog, state => ({
    ...state,
    selection: getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    }),
  })),
  _(ac.setSelectedCodebox, (state, { payload }) => ({
    ...state,
    selectedCodebox: payload,
  })),
]);

export { reducer as editorReducer, ac as editorActionCreators };
