import { createActionCreator as _, createReducer } from 'deox';
import { documentActionCreators } from '::root/store/ducks/document';
import { createActionPrefixer } from './helpers/shared';
import { TAlert } from '::types/react';

const ap = createActionPrefixer('dialogs');

const actionCreators = {
  showReloadDocument: _(ap('showReloadDocument')),
  hideReloadDocument: _(ap('hideReloadDocument')),
  setAlert: _(ap('setAlert'), _ => (alert: TAlert) => {
    if (alert?.error && process.env.NODE_ENV === 'development')
      // eslint-disable-next-line no-console
      console.error(alert.error);
    return _(alert);
  }),
  clearAlert: _(ap('clearAlert')),
};

type State = {
  showReloadDocument: boolean;
  alert?: TAlert;
};

const initialState: State = {
  showReloadDocument: false,
  alert: undefined,
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
  // alert
  _(actionCreators.setAlert, (state, { payload }) => ({
    ...state,
    alert: payload,
  })),
  _(
    actionCreators.clearAlert,
    state => ({ ...state, alert: undefined } as State),
  ),
]);

export { reducer as dialogsReducer, actionCreators as dialogsActionCreators };
