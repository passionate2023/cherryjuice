import { createActionCreator, createReducer } from 'deox';
import { createActionPrefixer } from '::root/store/ducks/shared';
const actionPrefixer = createActionPrefixer('node');
const actionCreators = {
  setId: createActionCreator(
    actionPrefixer('setId'),
    _ => ({ nodeId, node_id }: { nodeId: string; node_id: number }) =>
      _({ nodeId, node_id }),
  ),
  fetch: createActionCreator(actionPrefixer('fetch')),
  fetchStarted: createActionCreator(actionPrefixer('fetchStarted')),
  fetchFulfilled: createActionCreator(
    actionPrefixer('fetchFulfilled'),
    _ => (html: string) => _(html),
  ),
};

type State = {
  rootNodeId?: string;
  nodeId?: string;
  node_id?: number;
  html?: string;
  fetchInProgress: boolean;
};

const initialState: State = {
  html: '',
  nodeId: '',
  node_id: -1,
  fetchInProgress: false,
  rootNodeId: '',
};
const reducer = createReducer(initialState, _ => [
  _(actionCreators.setId, (state, { payload: { nodeId, node_id } }) => ({
    ...state,
    nodeId,
    node_id,
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
]);

export { reducer as nodeReducer, actionCreators as nodeActionCreators };
