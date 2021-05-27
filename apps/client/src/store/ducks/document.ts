import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '@cherryjuice/shared-helpers';
import { rootActionCreators as rac } from '::store/ducks/root';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { SelectNodeParams } from '::store/ducks/document-cache/helpers/document/select-node';
import { FilteredNodes } from '::store/epics/filter-tree/helpers/filter-tree/filter-tree';

const ap = createActionPrefixer('document');
const ac = {
  setDocumentId: _(ap('setDocumentId'), _ => (documentId: string) =>
    _(documentId),
  ),
  clone: _(ap('clone'), _ => (documentId: string) => _(documentId)),

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
  saveFulfilled: _(ap('save-fulfilled')),
  nothingToSave: _(ap('nothing-to-save')),
  saveInProgress: _(ap('save-in-progress')),
  saveFailed: _(ap('save-failed')),
  nodeCached: _(ap('node-cached')),
  cacheReset: _(ap('cache-reset')),
  export: _(ap('export'), _ => (documentId: string) => _(documentId)),
  exportFulfilled: _(ap('exportFulfilled')),
  clearFilteredNodes: _(ap('clear-filtered-nodes')),
  setFilteredNodes: _(ap('set-filtered-nodes'), _ => (params: FilteredNodes) =>
    _(params),
  ),
  setNodesFilter: _(ap('set-nodes-filter'), _ => (filter: string) => _(filter)),
  setSwappedIds: _(ap('set-swapped-ids'), _ => (ids: SwappedIds) => _(ids)),
};
type NodeId = {
  id: string;
  node_id: number;
};
export type AsyncOperation = 'in-progress' | 'idle' | 'pending';

export type SwappedIds = {
  [temporaryId: string]: string;
};
type State = {
  documentId: string;
  asyncOperations: {
    fetch: AsyncOperation;
    save: AsyncOperation;
  };
  filteredNodes: FilteredNodes;
  nodesFilter: string;
  swappedIds: SwappedIds;
};

const initialState: State = {
  documentId: '',
  asyncOperations: {
    fetch: 'idle',
    save: 'idle',
  },
  filteredNodes: undefined,
  nodesFilter: '',
  swappedIds: {},
};

const reducer = createReducer(cloneObj(initialState), _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
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
  _(ac.fetchFulfilled, (state, { payload }) => ({
    ...state,
    documentId: payload.document.id,
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

  _(ac.setSwappedIds, (state, { payload }) => ({
    ...state,
    swappedIds: payload,
  })),
  _(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./document-cache/document-cache').documentCacheActionCreators
      .deleteDocuments,
    // @ts-ignore
    (state, { payload }) => ({
      ...state,
      documentId: payload.includes(state.documentId) ? '' : state.documentId,
    }),
  ),
]);

export { reducer as documentReducer, ac as documentActionCreators };
export { NodeId, State as DocumentState };
