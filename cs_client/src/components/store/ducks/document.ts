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

const ap = createActionPrefixer('document');
const ac = {
  // document
  fetchNodes: _('fetchNodes', _ => () => {
    return _();
  }),
  fetchFailed: _('fetchFailed'),
  setDocumentId: _('setDocumentId', _ => (documentId: string) => _(documentId)),
  hasUnsavedChanges: _('hasUnsavedChanges', _ => (unsaved: boolean) =>
    _(unsaved),
  ),
  fetchNodesStarted: _('fetchNodesStarted'),
  fetchNodesFulfilled: _('fetchNodesFulfilled', _ => (nodes: nodesMetaMap) =>
    _(nodes),
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
  },
  ...{
    export: _('export'),
  },
  // node
  selectNode: _(ap('selectNode'), _ => (node: NodeId) => _(node)),
  selectRootNode: _(ap('selectRootNode'), _ => (node: NodeId) => _(node)),
  removeNodeFromRecentNodes: _(
    ap('removeNodeFromRecentNodes'),
    _ => (node_id: number) => _(node_id),
  ),
  clearSelectedNode: _(
    ap('clearSelectedNode'),
    _ => (payload: { removeChildren: boolean } = { removeChildren: false }) =>
      _(payload),
  ),
  fetch: _(ap('fetch')),
  fetchStarted: _(ap('fetchStarted')),
  fetchFulfilled: _(ap('fetchFulfilled'), _ => (html: string) => _(html)),
  setHighestNode_id: _(ap('setHighestNode_id'), _ => (node_id: number) =>
    _(node_id),
  ),
};
type NodeId = {
  id: string;
  node_id: number;
};
type AsyncOperation = 'in-progress' | 'idle' | 'pending';
type State = {
  nodes?: nodesMetaMap;
  fetchNodesStarted?: number;
  documentId: string;
  cacheTimeStamp: number;
  saveInProgress: AsyncOperation;
  selectedNode?: NodeId;
  rootNode?: NodeId;
  recentNodes: number[];
  highestNode_id: number;
  hasUnsavedChanges: boolean;
};

const initialState: State = {
  nodes: undefined,
  fetchNodesStarted: 0,
  documentId: '',
  cacheTimeStamp: 0,
  saveInProgress: 'idle',
  selectedNode: defaultRootNode,
  rootNode: defaultRootNode,
  recentNodes: [],
  highestNode_id: -1,
  hasUnsavedChanges: false,
};
const reducer = createReducer(cloneObj(initialState), _ => [
  _(ac.setDocumentId, (state, { payload }) => ({
    ...cloneObj(initialState),
    documentId: payload,
  })),
  _(ac.hasUnsavedChanges, (state, { payload }) => ({
    ...state,
    hasUnsavedChanges: payload,
  })),
  _(ac.fetchNodesFulfilled, (state, { payload }) => ({
    ...state,
    fetchNodesStarted: 0,
    nodes: payload,
    cacheTimeStamp: 0,
  })),
  _(ac.fetchNodesStarted, state => ({
    ...state,
    fetchNodesStarted: new Date().getTime(),
  })),
  _(ac.setCacheTimeStamp, (state, { payload }) =>
    state.saveInProgress !== 'idle'
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
  _(ac.selectNode, (state, { payload: node }) => ({
    ...state,
    selectedNode: node,
    recentNodes: [
      ...state.recentNodes.filter(node_id => node_id !== node.node_id),
      node.node_id,
    ],
  })),
  _(ac.selectRootNode, (state, { payload: node }) => ({
    ...state,
    rootNode: node,
    selectedNode: state.selectedNode.id
      ? state.selectedNode
      : getFallbackNode(state.nodes),
  })),
  _(ac.clearSelectedNode, (state, { payload: { removeChildren } }) => {
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
  _(ac.setHighestNode_id, (state, { payload: node_id }) => ({
    ...state,
    highestNode_id: node_id,
  })),
]);

export { reducer as documentReducer, ac as documentActionCreators };
export { NodeId, AsyncOperation };
