import { createActionCreator as _, createReducer } from 'deox';
import { documentActionCreators as dac } from './document';
import { documentsListActionCreators as dlac } from './documents-list';
import { createActionPrefixer } from './helpers/shared';
// @ts-ignore
import { AlertType, TAlert } from '::types/react';
import { cloneObj } from '@cherryjuice/shared-helpers';
import { rootActionCreators as rac } from '::store/ducks/root';
import { authActionCreators as aac } from './auth';

const ap = createActionPrefixer('dialogs');

const ac = {
  ...{
    showEditDocumentDialog: _(ap('showEditDocumentDialog')),
    hideDocumentMetaDialog: _(ap('hideDocumentMetaDialog')),
  },
  ...{
    showReloadDocument: _(ap('showReloadDocument')),
    hideReloadDocument: _(ap('hideReloadDocument')),
    showDeleteDocument: _(ap('show-delete-document')),
    hideDeleteDocument: _(ap('hide-delete-document')),
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
    showPasswordModal: _(ap('show-password-modal')),
    hidePasswordModal: _(ap('hide-password-modal')),
    confirmPasswordModal: _(
      ap('confirm-password-modal'),
      _ => (password: string) => _(password),
    ),
  },
  ...{
    setAlert: _(ap('setAlert'), _ => (alert: TAlert) => {
      if (alert?.error && process.env.NODE_ENV === 'development')
        // eslint-disable-next-line no-console
        // console.error(alert);
        setTimeout(() => {
          throw alert.error;
        });
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
    showEditNode: _(ap('show-edit-node')),
    hideNodeMeta: _(ap('hide-node-meta')),
  },
  ...{
    showUserPopup: _(ap('show-user-popup')),
    toggleUserPopup: _(ap('toggle-user-popup')),
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
  showAnchorDialog: _(ap('show-anchor-dialog')),
  hideAnchorDialog: _(ap('hide-anchor-dialog')),
  showLinkDialog: _(ap('show-link-dialog')),
  hideLinkDialog: _(ap('hide-link-dialog')),
  showCodeboxDialog: _(ap('show-codebox-dialog')),
  hideCodeboxDialog: _(ap('hide-codebox-dialog')),
  showTableDialog: _(ap('show-table-dialog')),
  hideTableDialog: _(ap('hide-table-dialog')),
  showBookmarksDialog: _(ap('show-bookmarks-dialog')),
  hideBookmarksDialog: _(ap('hide-bookmarks-dialog')),
};

export type Snackbar = { message: string; type?: AlertType; lifeSpan?: number };
type State = {
  showReloadDocument: boolean;
  showDeleteDocument: boolean;
  alert?: TAlert;
  showPasswordModal: boolean;
  showImportDocuments: boolean;
  showDocumentList: boolean;
  showDocumentMetaDialog: boolean;
  showNodeMetaDialog?: boolean;
  showDeleteNode: boolean;
  showUserPopup: boolean;
  showSettingsDialog: boolean;
  snackbar?: Snackbar;
  showAnchorDialog: boolean;
  showLinkDialog: boolean;
  showCodeboxDialog: boolean;
  showTableDialog: boolean;
  showBookmarks: boolean;
};

const initialState: State = {
  showDocumentMetaDialog: false,
  showReloadDocument: false,
  showDeleteDocument: false,
  showImportDocuments: false,
  showDocumentList: false,
  alert: undefined,
  showDeleteNode: false,
  showNodeMetaDialog: undefined,
  showPasswordModal: false,
  showUserPopup: false,
  showSettingsDialog: false,
  snackbar: undefined,
  showAnchorDialog: false,
  showLinkDialog: false,
  showCodeboxDialog: false,
  showTableDialog: false,
  showBookmarks: false,
};

const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(ac.showDeleteDocument, state => ({
    ...state,
    showDeleteDocument: true,
  })),
  _(dlac.deleteDocumentsFailed, state => ({
    ...state,
    showDeleteDocument: false,
  })),
  _(dlac.deleteDocumentsFulfilled, state => ({
    ...state,
    showDeleteDocument: false,
  })),
  _(ac.hideDeleteDocument, state => ({
    ...state,
    showDeleteDocument: false,
  })),
  _(ac.showReloadDocument, state => ({
    ...state,
    showReloadDocument: true,
  })),
  _(ac.hideReloadDocument, state => ({
    ...state,
    showReloadDocument: false,
  })),
  _(dac.fetchFulfilled, state => ({
    ...state,
    showReloadDocument: false,
    showDeleteDocument: false,
  })),
  // alert
  _(ac.setAlert, (state, { payload }) => ({
    ...state,
    alert: payload,
  })),
  _(ac.clearAlert, state => ({ ...state, alert: undefined } as State)),
  _(ac.showImportDocument, state => ({
    ...state,
    showImportDocuments: true,
    showDocumentList: false,
  })),
  _(ac.hideImportDocument, state => ({
    ...state,
    showImportDocuments: false,
  })),
  _(ac.showDocumentList, state => ({
    ...state,
    showDocumentList: true,
  })),
  _(ac.hideDocumentList, state => ({
    ...state,
    showDocumentList: false,
  })),

  ...[
    _(ac.showEditDocumentDialog, state => ({
      ...state,
      showDocumentMetaDialog: true,
    })),
    _(ac.hideDocumentMetaDialog, state => ({
      ...state,
      showDocumentMetaDialog: false,
    })),
  ],
  ...[
    _(ac.showDeleteNode, state => ({
      ...state,
      showDeleteNode: true,
    })),
    _(ac.hideDeleteNode, state => ({
      ...state,
      showDeleteNode: false,
    })),
  ],
  ...[
    _(ac.showEditNode, state => ({
      ...state,
      showNodeMetaDialog: true,
    })),
    _(ac.hideNodeMeta, state => ({
      ...state,
      showNodeMetaDialog: false,
    })),
  ],
  ...[
    _(ac.showUserPopup, state => ({
      ...state,
      showUserPopup: true,
    })),
    _(ac.hideUserPopup, state => ({
      ...state,
      showUserPopup: false,
    })),
    _(ac.toggleUserPopup, state => ({
      ...state,
      showUserPopup: !state.showUserPopup,
    })),
  ],
  ...[
    _(ac.showPasswordModal, state => ({
      ...state,
      showPasswordModal: true,
    })),
    _(ac.hidePasswordModal, state => ({
      ...state,
      showPasswordModal: false,
    })),
    _(ac.confirmPasswordModal, state => ({
      ...state,
      showPasswordModal: false,
    })),
  ],
  ...[
    _(ac.showSettingsDialog, state => ({
      ...state,
      showSettingsDialog: true,
      showUserPopup: false,
    })),
    _(ac.hideSettingsDialog, state => ({
      ...state,
      showSettingsDialog: false,
    })),
  ],
  ...[
    _(ac.setSnackbar, (state, { payload }) => ({
      ...state,
      snackbar: payload,
    })),
    _(
      ac.clearSnackbar,
      state =>
        ({
          ...state,
          snackbar: undefined,
        } as State),
    ),
  ],
  ...[
    _(aac.signIn, state => ({
      ...state,
      showUserPopup: false,
    })),
    _(aac.signUp, state => ({
      ...state,
      showUserPopup: false,
    })),
  ],
  _(ac.showAnchorDialog, state => ({
    ...state,
    showAnchorDialog: true,
  })),
  _(ac.hideAnchorDialog, state => ({
    ...state,
    showAnchorDialog: false,
  })),
  _(ac.showLinkDialog, state => ({
    ...state,
    showLinkDialog: true,
  })),
  _(ac.hideLinkDialog, state => ({
    ...state,
    showLinkDialog: false,
  })),
  _(ac.showCodeboxDialog, state => ({
    ...state,
    showCodeboxDialog: true,
  })),
  _(ac.hideCodeboxDialog, state => ({
    ...state,
    showCodeboxDialog: false,
  })),
  _(ac.showTableDialog, state => ({
    ...state,
    showTableDialog: true,
  })),
  _(ac.hideTableDialog, state => ({
    ...state,
    showTableDialog: false,
  })),
  _(ac.showBookmarksDialog, state => ({
    ...state,
    showBookmarks: true,
  })),
  _(ac.hideBookmarksDialog, state => ({
    ...state,
    showBookmarks: false,
  })),
]);

export { reducer as dialogsReducer, ac as dialogsActionCreators };
