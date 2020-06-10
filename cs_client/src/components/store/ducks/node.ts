import { createActionCreator, createReducer } from 'deox';
import { createActionPrefixer } from '::root/store/ducks/shared';
import { documentActionCreators } from './document';
import { cloneObj } from '::helpers/editing/execK/helpers';
const actionPrefixer = createActionPrefixer('node');
const actionCreators = {
  setSelected: createActionCreator(
    actionPrefixer('setSelected'),
    _ => (node: NodeId) => _(node),
  ),
  setRoot: createActionCreator(actionPrefixer('setRoot'), _ => (node: NodeId) =>
    _(node),
  ),
  removeNodeFromRecentNodes: createActionCreator(
    actionPrefixer('removeNodeFromRecentNodes'),
    _ => (node_id: number) => _(node_id),
  ),
  clearSelected: createActionCreator(actionPrefixer('clearSelected')),
  fetch: createActionCreator(actionPrefixer('fetch')),
  fetchStarted: createActionCreator(actionPrefixer('fetchStarted')),
  fetchFulfilled: createActionCreator(
    actionPrefixer('fetchFulfilled'),
    _ => (html: string) => _(html),
  ),
  setHighestNode_id: createActionCreator(
    actionPrefixer('setHighestNode_id'),
    _ => (node_id: number) => _(node_id),
  ),
};
type NodeId = {
  id: string;
  node_id: number;
};
type State = {
  html?: string;
  fetchInProgress: boolean;
  selectedNode?: NodeId;
  rootNode?: NodeId;
  recentNodes: number[];
  highestNode_id: number;
};

const initialState: State = cloneObj<State>({
  html: '',
  fetchInProgress: false,
  selectedNode: { node_id: 0, id: '' },
  rootNode: { node_id: 0, id: '' },
  recentNodes: [],
  highestNode_id: -1,
});
const reducer = createReducer(initialState, _ => [
  _(documentActionCreators.setDocumentId, () => ({
    ...cloneObj(initialState),
  })),
  _(actionCreators.fetchStarted, state => ({
    ...state,
    fetchInProgress: true,
  })),
  _(actionCreators.fetchFulfilled, (state, { payload }) => ({
    ...state,
    fetchInProgress: false,
    html: payload,
  })),
  _(actionCreators.setSelected, (state, { payload: node }) => ({
    ...state,
    selectedNode: node,
    recentNodes: [
      ...state.recentNodes.filter(node_id => node_id !== node.node_id),
      node.node_id,
    ],
  })),
  _(actionCreators.setRoot, (state, { payload: node }) => ({
    ...state,
    rootNode: node,
    selectedNode: state.selectedNode.id ? state.selectedNode : node,
  })),
  _(actionCreators.clearSelected, state => ({
    ...state,
    recentNodes: state.recentNodes.filter(
      node_id => state.selectedNode.node_id !== node_id,
    ),
    selectedNode: state.rootNode,
  })),
  _(actionCreators.setHighestNode_id, (state, { payload: node_id }) => ({
    ...state,
    highestNode_id: node_id,
  })),
]);

export { reducer as nodeReducer, actionCreators as nodeActionCreators };
