import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { rootActionCreators } from './root';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';
import { ClearSelectedNodeParams } from '::store/ducks/cache/document-cache/helpers/node/clear-selected-node';

const ap = createActionPrefixer('document');
const ac = {
  fetchNodes: _('fetchNodes', _ => () => {
    return _();
  }),
  fetchFailed: _('fetchFailed'),
  setDocumentId: _('setDocumentId', _ => (documentId: string) => _(documentId)),
  hasUnsavedChanges: _('hasUnsavedChanges', _ => (unsaved: boolean) =>
    _(unsaved),
  ),
  fetchNodesStarted: _('fetchNodesStarted'),
  fetchNodesFulfilled: _('fetchNodesFulfilled', _ => (args: QDocumentMeta) =>
    _(args),
  ),
  setCacheTimeStamp: _(
    'setCacheTimeStamp',
    _ => (timeStamp: number = new Date().getTime()) => _(timeStamp),
  ),
  ...{
    save: _('save'),
    savePending: _('savePending'),
    saveFulfilled: _('saveFulfilled'),
    saveInProgress: _('saveInProgress'),
    saveFailed: _('saveFailed'),
    nodeCached: _('node-cached'),
    cacheReset: _('cache-reset'),
  },
  ...{
    export: _('export'),
    exportFulfilled: _('exportFulfilled'),
  },
  // node
  selectNode: _(ap('selectNode'), _ => (payload: SelectNodeParams) =>
    _(payload),
  ),
  selectRootNode: _(
    ap('selectRootNode'),
    _ => (node: NodeId, documentId: string) => _(node, { documentId }),
  ),
  removeNodeFromRecentNodes: _(
    ap('removeNodeFromRecentNodes'),
    _ => (node_id: number) => _(node_id),
  ),
  clearSelectedNode: _(
    ap('clearSelectedNode'),
    _ => (payload: ClearSelectedNodeParams) => _(payload),
  ),
  fetch: _(ap('fetch')),
  fetchStarted: _(ap('fetchStarted')),
  fetchFulfilled: _(ap('fetchFulfilled'), _ => (html: string) => _(html)),
  setHighestNode_id: _(
    ap('setHighestNode_id'),
    _ => (node_id: number, documentId: string) => _(node_id, { documentId }),
  ),
};
type NodeId = {
  id: string;
  node_id: number;
};
type AsyncOperation = 'in-progress' | 'idle' | 'pending';

type State = {
  documentId: string;
  fetchNodesStarted?: number;
  saveInProgress: AsyncOperation;
};

const initialState: State = {
  documentId: '',
  fetchNodesStarted: 0,
  saveInProgress: 'idle',
};

const reducer = createReducer(cloneObj(initialState), _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  _(ac.setDocumentId, (state, { payload }) => ({
    ...cloneObj(initialState),
    documentId: payload,
  })),
  _(ac.fetchNodesFulfilled, state => ({
    ...state,
    fetchNodesStarted: 0,
  })),
  _(ac.fetchNodesStarted, state => ({
    ...state,
    fetchNodesStarted: new Date().getTime(),
  })),
  _(ac.fetchFailed, () => ({
    ...initialState,
  })),
  _(ac.savePending, state => ({
    ...state,
    saveInProgress: 'pending',
  })),
  _(ac.saveInProgress, state => ({
    ...state,
    saveInProgress: 'in-progress',
  })),
  _(ac.saveFulfilled, state => ({
    ...state,
    saveInProgress: 'idle',
  })),
  _(ac.saveFailed, state => ({
    ...state,
    saveInProgress: 'idle',
  })),
]);

export { reducer as documentReducer, ac as documentActionCreators };
export { NodeId, AsyncOperation, State as DocumentState };
