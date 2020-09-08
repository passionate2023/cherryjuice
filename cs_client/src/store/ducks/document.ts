import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { rootActionCreators } from './root';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';
import { FilteredNodes } from '::store/ducks/cache/document-cache/helpers/node/filter-tree/filter-tree';

const ap = createActionPrefixer('document');
const ac = {
  setDocumentId: _(ap('setDocumentId'), _ => (documentId: string) =>
    _(documentId),
  ),

  fetch: _(ap('fetch')),
  fetchInProgress: _(ap('fetch-in-progress')),
  fetchFulfilled: _(
    ap('fetch-fulfilled'),
    _ => (document: QDocumentMeta, nextNode?: SelectNodeParams) =>
      _({ document, nextNode }),
  ),
  fetchFailed: _(ap('fetch-failed')),

  save: _(ap('save')),
  savePending: _(ap('save-pending')),
  saveFulfilled: _(
    ap('save-fulfilled'),
    _ => (newSelectedDocumentId?: string) => _(newSelectedDocumentId),
  ),
  nothingToSave: _(ap('nothing-to-save')),
  saveInProgress: _(ap('save-in-progress')),
  saveFailed: _(ap('save-failed')),
  nodeCached: _(ap('node-cached')),
  cacheReset: _(ap('cache-reset')),

  export: _(ap('export')),
  exportFulfilled: _(ap('exportFulfilled')),
  clearFilteredNodes: _(ap('clear-filtered-nodes')),
  setFilteredNodes: _(ap('set-filtered-nodes'), _ => (params: FilteredNodes) =>
    _(params),
  ),
  setNodesFilter: _(ap('set-nodes-filter'), _ => (filter: string) => _(filter)),
  clearNodesFilter: _(ap('clear-nodes-filter')),
};
type NodeId = {
  id: string;
  node_id: number;
};
type AsyncOperation = 'in-progress' | 'idle' | 'pending';

type State = {
  documentId: string;
  asyncOperations: {
    fetch: AsyncOperation;
    save: AsyncOperation;
  };
  filteredNodes: FilteredNodes;
  nodesFilter: string;
};

const initialState: State = {
  documentId: '',
  asyncOperations: {
    fetch: 'idle',
    save: 'idle',
  },
  filteredNodes: undefined,
  nodesFilter: '',
};

const reducer = createReducer(cloneObj(initialState), _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  _(ac.setDocumentId, (state, { payload }) => ({
    ...state,
    documentId: payload,
  })),

  _(ac.fetchInProgress, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetch: 'in-progress',
    },
  })),
  _(ac.fetchFulfilled, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetch: 'idle',
    },
  })),
  _(ac.fetchFailed, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetch: 'idle',
    },
    documentId: '',
  })),

  _(ac.savePending, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      save: 'pending',
    },
  })),
  _(ac.saveInProgress, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      save: 'in-progress',
    },
  })),
  _(ac.saveFulfilled, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      save: 'idle',
    },
  })),
  _(ac.saveFailed, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      save: 'idle',
    },
  })),
  _(ac.setFilteredNodes, (state, { payload }) => ({
    ...state,
    filteredNodes: payload,
  })),
  _(
    ac.clearFilteredNodes,
    state =>
      ({
        ...state,
        filteredNodes: undefined,
      } as State),
  ),
  _(ac.setNodesFilter, (state, { payload }) => ({
    ...state,
    nodesFilter: payload,
  })),
  _(ac.clearNodesFilter, state => ({
    ...state,
    nodesFilter: '',
  })),
]);

export { reducer as documentReducer, ac as documentActionCreators };
export { NodeId, AsyncOperation, State as DocumentState };
