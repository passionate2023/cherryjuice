import { createActionCreator, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { documentActionCreators } from './document';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { rootActionCreators } from './root';
const actionPrefixer = createActionPrefixer('node');
const actionCreators = {
  fetch: createActionCreator(actionPrefixer('fetch')),
  fetchStarted: createActionCreator(actionPrefixer('fetchStarted')),
  processLinks: createActionCreator(actionPrefixer('process-links')),
  fetchFulfilled: createActionCreator(
    actionPrefixer('fetchFulfilled'),
    _ => (html: string) => _(html),
  ),
};

type State = {
  html?: string;
  fetchInProgress: boolean;
  processLinks: number;
};

const initialState: State = cloneObj<State>({
  html: '',
  fetchInProgress: false,
  processLinks: 0,
});
const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
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
]);

export { reducer as nodeReducer, actionCreators as nodeActionCreators };
