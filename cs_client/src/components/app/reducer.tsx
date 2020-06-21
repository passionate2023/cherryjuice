enum NodeMetaPopupRole {
  EDIT = 1,
  CREATE_SIBLING,
  CREATE_CHILD,
}

const initialState = {
  processLinks: undefined,
  createDocumentRequestId: undefined,
  treeSize: JSON.parse(localStorage.getItem('treeSize') as string) || 250,
  showSettings: false,
  showFormattingButtons: false,
  showRecentNodes: false,
  contentEditable: false,
  isOnMobile: false,
  showInfoBar: false,
  showUserPopup: false,
  showNodeMeta: undefined,
  showDeleteDocumentModal: false,
  snackbarMessage: undefined,
};

export type TState = typeof initialState & {
  showNodeMeta: NodeMetaPopupRole;
  createDocumentRequestId: number;
};
enum actions {
  setSnackbarMessage,
  TOGGLE_SETTINGS,
  TOGGLE_FORMATTING_BUTTONS,
  TOGGLE_RECENT_NODES_BAR,
  TOGGLE_INFO_BAR,
  RESIZE_TREE,
  SET_IS_ON_MOBILE,
  PROCESS_LINKS,
  HIDE_POPUPS,
  TOGGLE_USER_POPUP,
  SHOW_NODE_META,
  HIDE_NODE_META,
  TOGGLE_DELETE_DOCUMENT,
  createDocument,
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
    toggleUserPopup: (): void => {
      state.dispatch({ type: actions.TOGGLE_USER_POPUP });
    },
    setIsOnMobile: (isOnMobile: boolean): void => {
      state.dispatch({ type: actions.SET_IS_ON_MOBILE, value: isOnMobile });
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
    case actions.TOGGLE_USER_POPUP:
      return { ...state, showUserPopup: !state.showUserPopup };
    case actions.TOGGLE_DELETE_DOCUMENT:
      return {
        ...state,
        showDeleteDocumentModal: !state.showDeleteDocumentModal,
      };
    case actions.RESIZE_TREE:
      return { ...state, treeSize: action.value };
    case actions.HIDE_POPUPS:
      return { ...state, ...(state.isOnMobile && { showInfoBar: false }) };

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
