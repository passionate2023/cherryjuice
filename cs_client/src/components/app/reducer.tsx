import { TAlert } from '::types/react';
enum NodeMetaPopupRole {
  EDIT = 1,
  CREATE_SIBLING,
  CREATE_CHILD,
}

const initialState = {
  documentHasUnsavedChanges: false,
  processLinks: undefined,
  createDocumentRequestId: undefined,
  reloadFiles: 0,
  showTree: [
    JSON.parse(localStorage.getItem('showTree') as string),
  ].map(value => (value === null ? true : value === true))[0],
  treeSize: JSON.parse(localStorage.getItem('treeSize') as string) || 250,
  showFileSelect: location.pathname === '/',
  alert: undefined,
  showSettings: false,
  showFormattingButtons: false,
  showRecentNodes: false,
  contentEditable: false,
  isOnMobile: false,
  showInfoBar: false,
  showImportDocuments: false,
  showUserPopup: false,
  showNodeMeta: undefined,
  showDeleteDocumentModal: false,
  snackbarMessage: undefined,
  showDocumentMetaDialog: false,
};

export type TState = typeof initialState & {
  alert?: TAlert;
  showNodeMeta: NodeMetaPopupRole;
  createDocumentRequestId: number;
};
enum actions {
  setSnackbarMessage,
  TOGGLE_TREE,
  TOGGLE_TREE_ON,
  TOGGLE_TREE_OFF,
  TOGGLE_FILE_SELECT,
  TOGGLE_SETTINGS,
  TOGGLE_FORMATTING_BUTTONS,
  TOGGLE_RECENT_NODES_BAR,
  TOGGLE_INFO_BAR,
  RESIZE_TREE,
  RELOAD_DOCUMENT_LIST,
  SET_ALERT,
  SET_IS_ON_MOBILE,
  PROCESS_LINKS,
  HIDE_POPUPS,
  TOGGLE_SHOW_IMPORT_FILES,
  TOGGLE_USER_POPUP,
  SHOW_NODE_META,
  HIDE_NODE_META,
  TOGGLE_DELETE_DOCUMENT,
  showReloadConfirmationModal,
  documentHasUnsavedChanges,
  createDocument,
  showDocumentMetaDialog,
}
const createActionCreators = () => {
  const state = {
    // eslint-disable-next-line no-unused-vars
    dispatch: props => Error('dispatcher not set'),
  };
  return {
    setDispatch: (dispatch): void => (state.dispatch = dispatch),
    toggleFormattingButtons: (): void => {
      state.dispatch({ type: actions.TOGGLE_FORMATTING_BUTTONS });
    },
    toggleRecentBar: (): void => {
      state.dispatch({ type: actions.TOGGLE_RECENT_NODES_BAR });
    },
    toggleInfoBar: (): void => {
      state.dispatch({ type: actions.TOGGLE_INFO_BAR });
    },
    toggleShowImportDocuments: (): void => {
      state.dispatch({ type: actions.TOGGLE_SHOW_IMPORT_FILES });
    },
    toggleUserPopup: (): void => {
      state.dispatch({ type: actions.TOGGLE_USER_POPUP });
    },
    setIsOnMobile: (isOnMobile: boolean): void => {
      state.dispatch({ type: actions.SET_IS_ON_MOBILE, value: isOnMobile });
    },
    setAlert: (alert: TAlert): void => {
      state.dispatch({ type: actions.SET_ALERT, value: alert });
    },
    clearAlert: (): void => {
      state.dispatch({ type: actions.SET_ALERT, value: undefined });
    },
    reloadDocumentList: (): void => {
      state.dispatch({
        type: actions.RELOAD_DOCUMENT_LIST,
        value: new Date().getTime(),
      });
    },
    setTreeWidth: (width: number) => {
      state.dispatch({
        type: actions.RESIZE_TREE,
        value: width,
      });
    },
    toggleSettings: () => {
      state.dispatch({ type: actions.TOGGLE_SETTINGS });
    },
    toggleFileSelect: () => {
      state.dispatch({ type: actions.TOGGLE_FILE_SELECT });
    },
    showTree: () => {
      state.dispatch({ type: actions.TOGGLE_TREE_ON });
    },
    hideTree: () => {
      state.dispatch({ type: actions.TOGGLE_TREE_OFF });
    },
    toggleTree: () => {
      state.dispatch({ type: actions.TOGGLE_TREE });
    },
    hidePopups: () => {
      state.dispatch({ type: actions.HIDE_POPUPS });
    },
    processLinks(value: number) {
      state.dispatch({
        type: actions.PROCESS_LINKS,
        value,
      });
    },
    showNodeMetaEdit() {
      state.dispatch({
        type: actions.SHOW_NODE_META,
        value: NodeMetaPopupRole.EDIT,
      });
    },
    showNodeMetaCreateChild() {
      state.dispatch({
        type: actions.SHOW_NODE_META,
        value: NodeMetaPopupRole.CREATE_CHILD,
      });
    },
    showNodeMetaCreateSibling() {
      state.dispatch({
        type: actions.SHOW_NODE_META,
        value: NodeMetaPopupRole.CREATE_SIBLING,
      });
    },
    hideNodeMeta() {
      state.dispatch({
        type: actions.HIDE_NODE_META,
      });
    },
    toggleDeleteDocumentModal: () =>
      state.dispatch({
        type: actions.TOGGLE_DELETE_DOCUMENT,
      }),
    showReloadConfirmationModal: () => {
      state.dispatch({
        type: actions.showReloadConfirmationModal,
        value: true,
      });
    },

    documentHasUnsavedChanges: (documentHasUnsavedChanges: boolean) => {
      state.dispatch({
        type: actions.documentHasUnsavedChanges,
        value: documentHasUnsavedChanges,
      });
    },
    setSnackbarMessage: (snackbarMessage: string) => {
      state.dispatch({
        type: actions.setSnackbarMessage,
        value: snackbarMessage,
      });
    },
    clearSnackbarMessage: () => {
      state.dispatch({
        type: actions.setSnackbarMessage,
        value: undefined,
      });
    },
    createDocument: () => {
      state.dispatch({
        type: actions.createDocument,
        value: new Date().getTime(),
      });
    },
    showDocumentMetaDialog: () => {
      state.dispatch({
        type: actions.showDocumentMetaDialog,
        value: true,
      });
    },
    hideDocumentMetaDialog: () => {
      state.dispatch({
        type: actions.showDocumentMetaDialog,
        value: false,
      });
    },
  };
};
let reducer: (state: TState, action: { type: actions; value: any }) => TState;
reducer = (
  state: TState,
  action: {
    type: actions;
    value: any;
  },
): TState => {
  switch (action.type) {
    case actions.TOGGLE_TREE:
      return { ...state, showTree: !state.showTree };
    case actions.TOGGLE_TREE_ON:
      return { ...state, showTree: true };
    case actions.TOGGLE_TREE_OFF:
      return { ...state, showTree: false };
    case actions.TOGGLE_USER_POPUP:
      return { ...state, showUserPopup: !state.showUserPopup };
    case actions.TOGGLE_DELETE_DOCUMENT:
      return {
        ...state,
        showDeleteDocumentModal: !state.showDeleteDocumentModal,
      };
    case actions.TOGGLE_SHOW_IMPORT_FILES:
      return {
        ...state,
        showImportDocuments: !state.showImportDocuments,
        showFileSelect: false,
      };
    case actions.TOGGLE_FILE_SELECT:
      return {
        ...state,
        showFileSelect: !state.showFileSelect,
        reloadFiles: new Date().getTime(),
      };
    case actions.RESIZE_TREE:
      return { ...state, treeSize: action.value };
    case actions.HIDE_POPUPS:
      return { ...state, ...(state.isOnMobile && { showInfoBar: false }) };

    case actions.RELOAD_DOCUMENT_LIST:
      return {
        ...state,
        reloadFiles: action.value,
      };
    case actions.SET_ALERT:
      if (action.value?.error && process.env.NODE_ENV === 'development')
        // eslint-disable-next-line no-console
        console.error(action.value.error);
      return {
        ...state,
        alert: action.value,
        showImportDocuments: false,
      };
    case actions.TOGGLE_SETTINGS:
      return { ...state, showSettings: !state.showSettings };
    case actions.TOGGLE_RECENT_NODES_BAR:
      return {
        ...state,
        showRecentNodes: !state.showRecentNodes,
      };
    case actions.TOGGLE_FORMATTING_BUTTONS:
      return {
        ...state,
        showFormattingButtons: !state.showFormattingButtons,
        contentEditable: !state.showFormattingButtons,
      };
    case actions.TOGGLE_INFO_BAR:
      return { ...state, showInfoBar: !state.showInfoBar };
    case actions.SET_IS_ON_MOBILE:
      return { ...state, isOnMobile: action.value };
    case actions.PROCESS_LINKS:
      return { ...state, processLinks: action.value };
    case actions.SHOW_NODE_META:
      return { ...state, showNodeMeta: action.value };
    case actions.HIDE_NODE_META:
      return { ...state, showNodeMeta: undefined };

    case actions.documentHasUnsavedChanges:
      return {
        ...state,
        documentHasUnsavedChanges: action.value,
      };
    case actions.setSnackbarMessage:
      return {
        ...state,
        snackbarMessage: action.value,
      };
    case actions.createDocument:
      return {
        ...state,
        createDocumentRequestId: action.value,
      };
    case actions.showDocumentMetaDialog:
      return {
        ...state,
        showDocumentMetaDialog: action.value,
      };
    default:
      throw new Error(`action ${action.type} not supported`);
  }
};
const appActionCreators = createActionCreators();
export {
  initialState as appInitialState,
  reducer as appReducer,
  actions as appActions,
  appActionCreators,
};

export { NodeMetaPopupRole };
