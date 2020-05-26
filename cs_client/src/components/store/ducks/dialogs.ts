import { createActionCreator, createReducer } from 'deox';
import { documentActionCreators } from '::root/store/ducks/document';

const actionCreators = {
  showReloadDocument: createActionCreator('showReloadDocument'),
  hideReloadDocument: createActionCreator('hideReloadDocument'),
};

type State = {
  showReloadDocument: boolean;
};

const initialState: State = {
  showReloadDocument: false,
};
const reducer = createReducer(initialState, _ => [
  _(actionCreators.showReloadDocument, state => ({
    ...state,
    showReloadDocument: true,
  })),
  _(actionCreators.hideReloadDocument, state => ({
    ...state,
    showReloadDocument: false,
  })),
  _(documentActionCreators.fetchNodesFulfilled, state => ({
    ...state,
    showReloadDocument: false,
  })),
]);

export { reducer as dialogsReducer, actionCreators as dialogsActionCreators };
