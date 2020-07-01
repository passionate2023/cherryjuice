import { createActionCreator, createReducer } from 'deox';
import { createActionPrefixer } from '::root/store/ducks/helpers/shared';
import { documentActionCreators } from './document';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { rootActionCreators } from '::root/store/ducks/root';
const actionPrefixer = createActionPrefixer('node');
const actionCreators = {
  fetch: createActionCreator(actionPrefixer('fetch')),
  fetchStarted: createActionCreator(actionPrefixer('fetchStarted')),
  fetchFulfilled: createActionCreator(
    actionPrefixer('fetchFulfilled'),
    _ => (html: string) => _(html),
  ),
};

type State = {
  html?: string;
  fetchInProgress: boolean;
};

const initialState: State = cloneObj<State>({
  html: '',
  fetchInProgress: false,
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
