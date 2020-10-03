import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { rootActionCreators } from './root';
import { cloneObj } from '::helpers/objects';
import { dialogsActionCreators } from '::store/ducks/dialogs';
import {
  CustomRange,
  getSelection,
} from '::helpers/editing/execK/steps/get-selection';
import { LinkType } from '::root/components/app/components/menus/dialogs/link/reducer/reducer';
import { CodeboxProperties } from '::root/components/app/components/menus/dialogs/codebox/reducer/reducer';
import { TableProperties } from '::root/components/app/components/menus/dialogs/table/reducer/reducer';

const ap = createActionPrefixer('editor');

const ac = {
  showTree: _(ap('showTree')),
  hideTree: _(ap('hideTree')),
  toggleTree: _(ap('toggleTree')),
  toggleFormattingBar: _(ap('toggle-formatting-bar')),
  toggleRecentNodesBar: _(ap('toggle-recent-nodes-bar')),
  toggleInfoBar: _(ap('toggle-info-bar')),
  setAnchorId: _(ap('set-anchor-id'), _ => (id: string) => _(id)),
  setSelectedLink: _(ap('set-selected-link'), _ => (link: Link) => _(link)),
  setSelectedCodebox: _(
    ap('set-selected-codebox'),
    _ => (object: CodeboxProperties & { target: HTMLElement }) => _(object),
  ),
  setSelectedTable: _(
    ap('set-selected-table'),
    _ => (object: TableProperties & { target: HTMLElement }) => _(object),
  ),
  toggleNodePath: _(ap('toggle-node-path')),
};

export type Link = { href: string; type: LinkType; target: HTMLElement };
type State = {
  showTree: boolean;
  showFormattingButtons: boolean;
  contentEditable: boolean;
  showRecentNodesBar: boolean;
  showInfoBar: boolean;
  anchorId?: string;
  selectedLink: Link;
  selectedCodebox: CodeboxProperties & { target: HTMLElement };
  selectedTable: TableProperties & { target: HTMLElement };
  selection?: CustomRange;
  showNodePath: boolean;
};

const initialState: State = {
  showTree: true,
  contentEditable: true,
  showFormattingButtons: true,
  showRecentNodesBar: false,
  showInfoBar: false,
  anchorId: undefined,
  selectedLink: undefined,
  selection: undefined,
  selectedCodebox: undefined,
  selectedTable: undefined,
  showNodePath: true,
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
  _(dialogsActionCreators.showTableDialog, state => ({
    ...state,
    selection: getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    }),
  })),
  _(ac.setSelectedCodebox, (state, { payload }) => ({
    ...state,
    selectedCodebox: payload,
  })),
  _(ac.setSelectedTable, (state, { payload }) => ({
    ...state,
    selectedTable: payload,
  })),
  _(ac.toggleNodePath, state => ({
    ...state,
    showNodePath: !state.showNodePath,
  })),
]);

export { reducer as editorReducer, ac as editorActionCreators };
