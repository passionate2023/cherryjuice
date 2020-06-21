import { createActionCreator as _, createReducer } from 'deox';
import { documentActionCreators } from '::root/store/ducks/document';
import { createActionPrefixer } from './helpers/shared';
import { TAlert } from '::types/react';

const ap = createActionPrefixer('dialogs');

const actionCreators = {
  ...{
    showEditDocumentDialog: _(
      ap('showEditDocumentDialog'),
      _ => (documentId: string) => _(documentId),
    ),
    showCreateDocumentDialog: _(ap('showCreateDocumentDialog')),
    hideDocumentMetaDialog: _(ap('hideDocumentMetaDialog')),
  },
  ...{
    showReloadDocument: _(ap('showReloadDocument')),
    hideReloadDocument: _(ap('hideReloadDocument')),
  },
  ...{
    showImportDocument: _(ap('showImportDocument')),
    hideImportDocument: _(ap('hideImportDocument')),
  },
  ...{
    showDocumentList: _(ap('showDocumentList')),
    hideDocumentList: _(ap('hideDocumentList')),
  },
  ...{
    setAlert: _(ap('setAlert'), _ => (alert: TAlert) => {
      if (alert?.error && process.env.NODE_ENV === 'development')
        // eslint-disable-next-line no-console
        console.error(alert.error);
      return _(alert);
    }),
    clearAlert: _(ap('clearAlert')),
  },
};

type State = {
  showReloadDocument: boolean;
  alert?: TAlert;
  showImportDocuments: boolean;
  showDocumentList: boolean;
  showDocumentMetaDialog?: 'edit' | 'create';
};

const initialState: State = {
  showReloadDocument: false,
  showImportDocuments: false,
  showDocumentList: false,
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

  ...[
    _(actionCreators.showCreateDocumentDialog, state => ({
      ...state,
      showDocumentMetaDialog: 'create',
    })),
    _(actionCreators.showEditDocumentDialog, (state, { payload }) => ({
      ...state,
      documentMetaDialogDocumentId: payload,
      showDocumentMetaDialog: 'edit',
    })),
    _(
      actionCreators.hideDocumentMetaDialog,
      state =>
        ({
          ...state,
          showDocumentMetaDialog: undefined,
        } as State),
    ),
  ],
]);

export { reducer as dialogsReducer, actionCreators as dialogsActionCreators };
