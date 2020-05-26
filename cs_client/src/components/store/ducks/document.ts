import { createActionCreator, createReducer } from 'deox';
import { nodesMetaMap } from '::types/misc';
import { applyLocalModifications } from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';

const actionCreators = {
  fetchNodes: createActionCreator('fetchNodes'),
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
    _ => (timeStamp: number = new Date().getTime()) => _(timeStamp),
  ),
  save: createActionCreator('save'),
};

type State = {
  nodes?: nodesMetaMap;
  fetchNodesStarted: boolean;
  documentId: string;
  cacheTimeStamp: number;
};

const initialState: State = {
  nodes: undefined,
  fetchNodesStarted: false,
  documentId: '',
  cacheTimeStamp: 0,
};
const reducer = createReducer(initialState, _ => [
  _(actionCreators.setDocumentId, (state, { payload }) => ({
    ...state,
    documentId: payload,
  })),
  _(actionCreators.fetchNodesFulfilled, (state, { payload }) => ({
    ...state,
    fetchNodesStarted: false,
    nodes: payload,
  })),
  _(actionCreators.fetchNodesStarted, state => ({
    ...state,
    fetchNodesStarted: true,
  })),
  _(actionCreators.setCacheTimeStamp, (state, { payload }) => ({
    ...state,
    cacheTimeStamp: payload,
    nodes: applyLocalModifications({
      nodes: state.nodes,
      file_id: state.documentId,
    }),
  })),
]);

export { reducer as documentReducer, actionCreators as documentActionCreators };
