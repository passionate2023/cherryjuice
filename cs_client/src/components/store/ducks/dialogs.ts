import { createActionCreator as _, createReducer } from 'deox';
import { documentActionCreators } from '::root/store/ducks/document';
import { createActionPrefixer } from './helpers/shared';
import { TAlert } from '::types/react';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { rootActionCreators } from '::root/store/ducks/root';
import { authActionCreators } from '::root/store/ducks/auth';

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
        console.error(alert);
      if (alert.error?.message.includes('errorId')) {
        // @ts-ignore
        const { graphQLErrors } = alert.error;
        if (graphQLErrors?.length) {
          const { description } = JSON.parse(graphQLErrors[0].message);
          alert.description = description;
        }
      }
      return _(alert);
    }),
    clearAlert: _(ap('clearAlert')),
  },
  ...{
    showDeleteNode: _(ap('show-delete-node')),
    hideDeleteNode: _(ap('hide-delete-node')),
  },
  ...{
    showCreateChildNode: _(ap('show-create-child-node')),
    showCreateSiblingNode: _(ap('show-create-sibling-node')),
    showEditNode: _(ap('show-edit-node')),
    hideNodeMeta: _(ap('hide-node-meta')),
  },
  ...{
    showUserPopup: _(ap('show-user-popup')),
    hideUserPopup: _(ap('hide-user-popup')),
  },
  ...{
    showSettingsDialog: _(ap('show-settings-dialog')),
    hideSettingsDialog: _(ap('hide-settings-dialog')),
  },
  ...{
    setSnackbar: _(ap('set-snackbar'), _ => (snackbar: Snackbar) =>
      _(snackbar),
    ),
    clearSnackbar: _(ap('clear-snackbar')),
  },
};

type NodeMetaDialogRole = 'edit' | 'create-child' | 'create-sibling';
type Snackbar = { message: string };
type State = {
  showReloadDocument: boolean;
  alert?: TAlert;
  showImportDocuments: boolean;
  showDocumentList: boolean;
  showDocumentMetaDialog?: 'edit' | 'create';
  showNodeMetaDialog?: NodeMetaDialogRole;
  showDeleteNode: boolean;
  showUserPopup: boolean;
  showSettingsDialog: boolean;
  snackbar?: Snackbar;
};

const initialState: State = {
  showReloadDocument: false,
  showImportDocuments: false,
  showDocumentList: false,
  alert: undefined,
  showDeleteNode: false,
  showNodeMetaDialog: undefined,
  showUserPopup: false,
  showSettingsDialog: true,
  snackbar: undefined,
};

const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
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
  ...[
    _(actionCreators.showDeleteNode, state => ({
      ...state,
      showDeleteNode: true,
    })),
    _(actionCreators.hideDeleteNode, state => ({
      ...state,
      showDeleteNode: false,
    })),
  ],
  ...[
    _(actionCreators.showCreateChildNode, state => ({
      ...state,
      showNodeMetaDialog: 'create-child',
    })),
    _(actionCreators.showCreateSiblingNode, state => ({
      ...state,
      showNodeMetaDialog: 'create-sibling',
    })),
    _(actionCreators.showEditNode, state => ({
      ...state,
      showNodeMetaDialog: 'edit',
    })),
    _(
      actionCreators.hideNodeMeta,
      state =>
        ({
          ...state,
          showNodeMetaDialog: undefined,
        } as State),
    ),
  ],
  ...[
    _(actionCreators.showUserPopup, state => ({
      ...state,
      showUserPopup: true,
    })),
    _(actionCreators.hideUserPopup, state => ({
      ...state,
      showUserPopup: false,
    })),
  ],
  ...[
    _(actionCreators.showSettingsDialog, state => ({
      ...state,
      showSettingsDialog: true,
      showUserPopup: false,
    })),
    _(actionCreators.hideSettingsDialog, state => ({
      ...state,
      showSettingsDialog: false,
    })),
  ],
  ...[
    _(actionCreators.setSnackbar, (state, { payload }) => ({
      ...state,
      snackbar: payload,
    })),
    _(
      actionCreators.clearSnackbar,
      state =>
        ({
          ...state,
          snackbar: undefined,
        } as State),
    ),
  ],
  ...[
    _(authActionCreators.signIn, state => ({
      ...state,
      showUserPopup: false,
    })),
    _(authActionCreators.signUp, state => ({
      ...state,
      showUserPopup: false,
    })),
  ],
]);

export { reducer as dialogsReducer, actionCreators as dialogsActionCreators };
export { NodeMetaDialogRole };
