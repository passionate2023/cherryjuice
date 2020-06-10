import { createActionCreator as _, createReducer } from 'deox';
import { nodesMetaMap } from '::types/misc';
import { applyLocalModifications } from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/editing/execK/helpers';
import {
  calcRecentNodes,
  defaultRootNode,
  getFallbackNode,
} from './helpers/document';

enum asyncOperation {
  pending = 'pending',
  inProgress = 'inProgress',
  idle = 'idle',
}

const AP = createActionPrefixer('document');
const ACs = {
  // document
  fetchNodes: _('fetchNodes', _ => () => {
    return _();
  }),
  fetchFailed: _('fetchFailed'),
  setDocumentId: _('setDocumentId', _ => (documentId: string) => _(documentId)),
  fetchNodesStarted: _('fetchNodesStarted'),
  fetchNodesFulfilled: _('fetchNodesFulfilled', _ => (nodes: nodesMetaMap) =>
    _(nodes),
  ),
  setCacheTimeStamp: _(
    'setCacheTimeStamp',
    _ => (timeStamp: number = new Date().getTime()) => {
      return _(timeStamp);
    },
  ),
  save: _('save'),
  saveFulfilled: _('saveFulfilled'),
  saveInProgress: _('saveInProgress'),
  // node
  selectNode: _(AP('selectNode'), _ => (node: NodeId) => _(node)),
  selectRootNode: _(AP('selectRootNode'), _ => (node: NodeId) => _(node)),
  removeNodeFromRecentNodes: _(
    AP('removeNodeFromRecentNodes'),
    _ => (node_id: number) => _(node_id),
  ),
  clearSelectedNode: _(
    AP('clearSelectedNode'),
    _ => (payload: { removeChildren: boolean } = { removeChildren: false }) =>
      _(payload),
  ),
  fetch: _(AP('fetch')),
  fetchStarted: _(AP('fetchStarted')),
  fetchFulfilled: _(AP('fetchFulfilled'), _ => (html: string) => _(html)),
  setHighestNode_id: _(AP('setHighestNode_id'), _ => (node_id: number) =>
    _(node_id),
  ),
};
type NodeId = {
  id: string;
  node_id: number;
};
type State = {
  nodes?: nodesMetaMap;
  fetchNodesStarted?: number;
  documentId: string;
  cacheTimeStamp: number;
  saveInProgress: asyncOperation;
  selectedNode?: NodeId;
  rootNode?: NodeId;
  recentNodes: number[];
  highestNode_id: number;
};

const initialState: State = {
  nodes: undefined,
  fetchNodesStarted: 0,
  documentId: '',
  cacheTimeStamp: 0,
  saveInProgress: asyncOperation.idle,
  selectedNode: defaultRootNode,
  rootNode: defaultRootNode,
  recentNodes: [],
  highestNode_id: -1,
};
const reducer = createReducer(cloneObj(initialState), _ => [
  _(ACs.setDocumentId, (state, { payload }) => ({
    ...cloneObj(initialState),
    documentId: payload,
  })),
  _(ACs.fetchNodesFulfilled, (state, { payload }) => ({
    ...state,
    fetchNodesStarted: 0,
    nodes: payload,
  })),
  _(ACs.fetchNodesStarted, state => ({
    ...state,
    fetchNodesStarted: new Date().getTime(),
  })),
  _(ACs.setCacheTimeStamp, (state, { payload }) =>
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
  _(ACs.fetchFailed, () => ({
    ...initialState,
  })),
  _(ACs.save, state => ({
    ...state,
    saveInProgress: asyncOperation.pending,
  })),
  _(ACs.saveInProgress, state => ({
    ...state,
    saveInProgress: asyncOperation.inProgress,
  })),
  _(ACs.saveFulfilled, state => ({
    ...state,
    saveInProgress: asyncOperation.idle,
  })),
  _(ACs.selectNode, (state, { payload: node }) => ({
    ...state,
    selectedNode: node,
    recentNodes: [
      ...state.recentNodes.filter(node_id => node_id !== node.node_id),
      node.node_id,
    ],
  })),
  _(ACs.selectRootNode, (state, { payload: node }) => ({
    ...state,
    rootNode: node,
    selectedNode: state.selectedNode.id
      ? state.selectedNode
      : getFallbackNode(state.nodes),
  })),
  _(ACs.clearSelectedNode, (state, { payload: { removeChildren } }) => {
    return {
      ...state,
      recentNodes: calcRecentNodes({
        nodes: state.nodes,
        recentNodes: state.recentNodes,
        removeChildren,
        selectedNode_id: state.selectedNode.node_id,
      }),
      selectedNode: getFallbackNode(state.nodes),
    };
  }),
  _(ACs.setHighestNode_id, (state, { payload: node_id }) => ({
    ...state,
    highestNode_id: node_id,
  })),
  _(ACs.setHighestNode_id, (state, { payload: node_id }) => ({
    ...state,
    highestNode_id: node_id,
  })),
]);

export { reducer as documentReducer, ACs as documentActionCreators };
export { asyncOperation, NodeId };
