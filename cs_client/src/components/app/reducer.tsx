import { TAlert } from '::types/react';
import { NodeMeta } from '::types/graphql/adapters';
enum NodeMetaPopup {
  EDIT = 1,
  CREATE_SIBLING,
  CREATE_CHILD,
}
export type TNodeMeta = {
  name: string;
  style: { color: string; fontWeight: 'normal' | 'bold' };
  icon_id: string;
  nodeId: string;
  id: number;
  is_richtxt: string;
  createdAt: string;
  updatedAt: string;
};
const initialState = {
  showTree: [JSON.parse(localStorage.getItem('showTree'))].map(value =>
    value === null ? true : value === true,
  )[0],
  treeSize: JSON.parse(localStorage.getItem('treeSize')) || 250,
  selectedNode: undefined,
  selectedFile:
    [localStorage.getItem('selectedFile')].filter(
      value => Boolean(value) && value !== 'null',
    )[0] || '',
  showFileSelect:
    !localStorage.getItem('selectedFile') && location.pathname === '/',
  recentNodes: [], //recentNodes ? { [selectedNode]: recentNodes[selectedNode] } : {}
  saveDocument: '',
  reloadDocument: 0,
  reloadFiles: 0,
  alert: undefined,
  showSettings: false,
  showFormattingButtons: false,
  showRecentNodes: false,
  contentEditable: false,
  isOnMobile: false,
  showInfoBar: false,
  processLinks: undefined,
  showImportDocuments: false,
  showUserPopup: false,
  showNodeMeta: undefined,
  highest_node_id: -1,
  showDeleteDocumentModal: false,
  rootNode: undefined,
  showReloadConfirmationModal: false,
  documentHasUnsavedChanges: false,
  snackbarMessage: undefined,
};

export type TState = typeof initialState & {
  selectedNode: TNodeMeta;
  rootNode: NodeMeta;
  recentNodes: TNodeMeta[];
  alert: TAlert;
  showNodeMeta: NodeMetaPopup;
};
enum actions {
  setSnackbarMessage,
  hideReloadConfirmationModal,
  TOGGLE_TREE,
  TOGGLE_TREE_ON,
  TOGGLE_TREE_OFF,
  TOGGLE_FILE_SELECT,
  TOGGLE_SETTINGS,
  TOGGLE_FORMATTING_BUTTONS,
  TOGGLE_CONTENT_EDITABLE,
  TOGGLE_RECENT_NODES_BAR,
  TOGGLE_INFO_BAR,
  RESIZE_TREE,
  SELECT_NODE,
  SELECT_FILE,
  SAVE_DOCUMENT,
  RELOAD_DOCUMENT,
  RELOAD_DOCUMENT_LIST,
  SET_ALERT,
  SET_IS_ON_MOBILE,
  PROCESS_LINKS,
  HIDE_POPUPS,
  TOGGLE_SHOW_IMPORT_FILES,
  TOGGLE_USER_POPUP,
  SHOW_NODE_META,
  HIDE_NODE_META,
  SET_HIGHEST_NODE_ID,
  TOGGLE_DELETE_DOCUMENT,
  SET_ROOT_NODE,
  showReloadConfirmationModal,
  documentHasUnsavedChanges,
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
    toggleContentEditable: (): void => {
      state.dispatch({ type: actions.TOGGLE_CONTENT_EDITABLE });
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
    saveDocument: () => {
      state.dispatch({
        type: actions.SAVE_DOCUMENT,
        value: new Date().getTime(),
      });
    },
    reloadDocument: () => {
      state.dispatch({
        type: actions.RELOAD_DOCUMENT,
        value: new Date().getTime(),
      });
    },
    selectFile: (fileId: string) =>
      state.dispatch({ type: actions.SELECT_FILE, value: fileId }),
    selectNode: (node: TNodeMeta) =>
      state.dispatch({
        type: actions.SELECT_NODE,
        value: node,
      }),
    processLinks(value: number) {
      state.dispatch({
        type: actions.PROCESS_LINKS,
        value,
      });
    },
    showNodeMetaEdit() {
      state.dispatch({
        type: actions.SHOW_NODE_META,
        value: NodeMetaPopup.EDIT,
      });
    },
    showNodeMetaCreateChild() {
      state.dispatch({
        type: actions.SHOW_NODE_META,
        value: NodeMetaPopup.CREATE_CHILD,
      });
    },
    showNodeMetaCreateSibling() {
      state.dispatch({
        type: actions.SHOW_NODE_META,
        value: NodeMetaPopup.CREATE_SIBLING,
      });
    },
    hideNodeMeta() {
      state.dispatch({
        type: actions.HIDE_NODE_META,
      });
    },
    setHighestNodeId: (highest_node_id: number) =>
      state.dispatch({
        type: actions.SET_HIGHEST_NODE_ID,
        value: { highest_node_id },
      }),
    toggleDeleteDocumentModal: () =>
      state.dispatch({
        type: actions.TOGGLE_DELETE_DOCUMENT,
      }),
    setRootNode: (node: NodeMeta) =>
      state.dispatch({
        type: actions.SET_ROOT_NODE,
        value: { node },
      }),
    showReloadConfirmationModal: () => {
      state.dispatch({
        type: actions.showReloadConfirmationModal,
        value: true,
      });
    },
    hideReloadConfirmationModal: () => {
      state.dispatch({
        type: actions.showReloadConfirmationModal,
        value: false,
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
  };
};
const reducer = (
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
    case actions.SELECT_NODE:
      return {
        ...state,
        selectedNode: action.value,
        recentNodes: action.value
          ? [
              ...state.recentNodes.filter(
                node => +node.id !== +action.value.id,
              ),
              action.value,
            ]
          : state.recentNodes,
      };
    case actions.SELECT_FILE:
      return {
        ...state,
        selectedFile: action.value,
        showTree: true,
        selectedNode: undefined,
      };
    case actions.SAVE_DOCUMENT:
      return {
        ...state,
        saveDocument: action.value,
      };
    case actions.RELOAD_DOCUMENT:
      return {
        ...state,
        reloadDocument: action.value,
        showReloadConfirmationModal: false,
      };
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
    case actions.TOGGLE_CONTENT_EDITABLE:
      return { ...state, contentEditable: !state.contentEditable };
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
    case actions.SET_HIGHEST_NODE_ID:
      return {
        ...state,
        highest_node_id: action.value.highest_node_id,
      };
    case actions.SET_ROOT_NODE:
      return { ...state, rootNode: action.value.node };
    case actions.showReloadConfirmationModal:
      return { ...state, showReloadConfirmationModal: action.value };
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
    default:
      throw new Error('action not supported');
  }
};
const appActionCreators = createActionCreators();
export {
  initialState as appInitialState,
  reducer as appReducer,
  actions as appActions,
  appActionCreators,
};

export { NodeMetaPopup };
