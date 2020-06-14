import { createActionCreator as _, createReducer } from 'deox';
import { documentActionCreators } from '::root/store/ducks/document';
import { createActionPrefixer } from './helpers/shared';
import { TAlert } from '::types/react';

const ap = createActionPrefixer('dialogs');

const actionCreators = {
  showReloadDocument: _(ap('showReloadDocument')),
  showImportDocument: _(ap('showImportDocument')),
  hideImportDocument: _(ap('hideImportDocument')),
  hideReloadDocument: _(ap('hideReloadDocument')),
  showDocumentList: _(ap('showDocumentList')),
  hideDocumentList: _(ap('hideDocumentList')),
  reloadDocumentList: _(ap('reloadDocumentList')),
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
  showImportDocuments: boolean;
  showDocumentList: boolean;
  alert?: TAlert;
  reloadDocumentList: number;
};

const initialState: State = {
  showReloadDocument: false,
  alert: undefined,
  showImportDocuments: false,
  showDocumentList: false,
  reloadDocumentList: 0,
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
  _(actionCreators.showImportDocument, state => ({
    ...state,
    showImportDocuments: true,
    showDocumentList: false,
  })),
  _(actionCreators.hideImportDocument, state => ({
    ...state,
    showImportDocuments: false,
  })),
  _(actionCreators.showDocumentList, state => ({
    ...state,
    showDocumentList: true,
    reloadDocumentList: new Date().getTime(),
  })),
  _(actionCreators.hideDocumentList, state => ({
    ...state,
    showDocumentList: false,
  })),
  _(actionCreators.reloadDocumentList, state => ({
    ...state,
    reloadDocumentList: new Date().getTime(),
  })),
]);

export { reducer as dialogsReducer, actionCreators as dialogsActionCreators };
