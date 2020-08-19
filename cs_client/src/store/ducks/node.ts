import { createActionCreator, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { rootActionCreators } from './root';
const actionPrefixer = createActionPrefixer('node');
const actionCreators = {
  fetch: createActionCreator(actionPrefixer('fetch')),
  fetchStarted: createActionCreator(actionPrefixer('fetchStarted')),
  processLinks: createActionCreator(actionPrefixer('process-links')),
  fetchFulfilled: createActionCreator(actionPrefixer('fetchFulfilled')),
  fetchFailed: createActionCreator(actionPrefixer('fetch-failed')),
};

type State = {
  fetchInProgress: boolean;
  processLinks: number;
};

const initialState: State = cloneObj<State>({
  fetchInProgress: false,
  processLinks: 0,
});
const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  _(actionCreators.fetchStarted, state => ({
    ...state,
    fetchInProgress: true,
  })),
  _(actionCreators.fetchFulfilled, state => ({
    ...state,
    fetchInProgress: false,
  })),
  _(actionCreators.fetchFailed, state => ({
    ...state,
    fetchInProgress: false,
  })),
]);

export { reducer as nodeReducer, actionCreators as nodeActionCreators };
