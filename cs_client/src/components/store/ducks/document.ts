import { createActionCreator, createReducer } from 'deox';
import { nodesMetaMap } from '::types/misc';
import { applyLocalModifications } from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';

enum asyncOperation {
  pending = 'pending',
  inProgress = 'inProgress',
  idle = 'idle',
}
const actionCreators = {
  fetchNodes: createActionCreator('fetchNodes', _ => () => {
    return _();
  }),
  fetchFailed: createActionCreator('fetchFailed'),
  setDocumentId: createActionCreator(
    'setDocumentId',
    _ => (documentId: string) => _(documentId),
  ),
  fetchNodesStarted: createActionCreator('fetchNodesStarted'),
  fetchNodesFulfilled: createActionCreator(
    'fetchNodesFulfilled',
    _ => (nodes: nodesMetaMap) => _(nodes),
  ),
  setCacheTimeStamp: createActionCreator(
    'setCacheTimeStamp',
    _ => (timeStamp: number = new Date().getTime()) => {
      return _(timeStamp);
    },
  ),
  save: createActionCreator('save'),
  saveFulfilled: createActionCreator('saveFulfilled'),
  saveInProgress: createActionCreator('saveInProgress'),
};

type State = {
  nodes?: nodesMetaMap;
  fetchNodesStarted?: number;
  documentId: string;
  cacheTimeStamp: number;
  saveInProgress: asyncOperation;
};

const initialState: State = {
  nodes: undefined,
  fetchNodesStarted: 0,
  documentId: '',
  cacheTimeStamp: 0,
  saveInProgress: asyncOperation.idle,
};
const reducer = createReducer(initialState, _ => [
  _(actionCreators.setDocumentId, (state, { payload }) => ({
    ...state,
    documentId: payload,
    nodes: undefined,
  })),
  _(actionCreators.fetchNodesFulfilled, (state, { payload }) => ({
    ...state,
    fetchNodesStarted: 0,
    nodes: payload,
  })),
  _(actionCreators.fetchNodesStarted, state => ({
    ...state,
    fetchNodesStarted: new Date().getTime(),
  })),
  _(actionCreators.setCacheTimeStamp, (state, { payload }) =>
    state.saveInProgress !== asyncOperation.idle
      ? state
      : {
          ...state,
          cacheTimeStamp: payload,
          nodes: applyLocalModifications({
            nodes: state.nodes,
            file_id: state.documentId,
          }),
        },
  ),
  _(actionCreators.fetchFailed, () => ({
    ...initialState,
  })),
  _(actionCreators.save, state => ({
    ...state,
    saveInProgress: asyncOperation.pending,
  })),
  _(actionCreators.saveInProgress, state => ({
    ...state,
    saveInProgress: asyncOperation.inProgress,
  })),
  _(actionCreators.saveFulfilled, state => ({
    ...state,
    saveInProgress: asyncOperation.idle,
  })),
]);

export { reducer as documentReducer, actionCreators as documentActionCreators };
export { asyncOperation };
