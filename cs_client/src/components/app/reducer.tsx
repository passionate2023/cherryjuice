import { TAlert } from '::types/react';

const defaultSelectNode = {
  id: -1,
  name: '',
  is_richtxt: '',
  createdAt: '',
  updatedAt: '',
  style: {},
};
const initialState = {
  showTree: [JSON.parse(localStorage.getItem('showTree'))].map(value =>
    value === null ? true : value === true,
  )[0],
  treeSize: JSON.parse(localStorage.getItem('treeSize')) || 250,
  selectedNode: defaultSelectNode,
  selectedFile:
    [localStorage.getItem('selectedFile')].filter(
      value => Boolean(value) && value !== 'null',
    )[0] || '',
  showFileSelect:
    !localStorage.getItem('selectedFile') && location.pathname === '/',
  recentNodes: [], //recentNodes ? { [selectedNode]: recentNodes[selectedNode] } : {}
  saveDocument: 0,
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
};
export type TRecentNode = {
  id: number;
  name: string;
  style?: Record<string, string | number>;
  is_richtxt: string;
  createdAt: string;
  updatedAt: string;
};
export type TState = typeof initialState & {
  selectedNode: TRecentNode;
  recentNodes: TRecentNode[];
  alert: TAlert;
};
enum actions {
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
  RELOAD_FILES,
  SET_ALERT,
  SET_IS_ON_MOBILE,
  PROCESS_LINKS,
  HIDE_POPUPS,
  TOGGLE_SHOW_IMPORT_FILES,
  TOGGLE_USER_POPUP,
}
const createActionCreators = () => {
  const state = {
    // eslint-disable-next-line no-unused-vars
    dispatch: props => Error('dispatcher not set'),
  };
  return {
    setDispatch: newDispatch => (state.dispatch = newDispatch),
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
    setReloadFiles: (): void => {
      state.dispatch({
        type: actions.RELOAD_FILES,
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
    saveDocument: e => {
      state.dispatch({
        type: actions.SAVE_DOCUMENT,
        value: e.shiftKey ? new Date().getTime() : new Date().getTime() + '_', // don't send to the server
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
    selectNode: (
      { node_id, name, style },
      { is_richtxt, createdAt, updatedAt },
    ) =>
      state.dispatch({
        type: actions.SELECT_NODE,
        value: { node_id, name, style, is_richtxt, createdAt, updatedAt },
      }),
    processLinks(value: number) {
      state.dispatch({
        type: actions.PROCESS_LINKS,
        value,
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
    case actions.TOGGLE_SHOW_IMPORT_FILES:
      return {
        ...state,
        showImportDocuments: !state.showImportDocuments,
      };
    case actions.TOGGLE_FILE_SELECT:
      return { ...state, showFileSelect: !state.showFileSelect };
    case actions.RESIZE_TREE:
      return { ...state, treeSize: action.value };
    case actions.HIDE_POPUPS:
      return { ...state, ...(state.isOnMobile && { showInfoBar: false }) };
    case actions.SELECT_NODE:
      return {
        ...state,
        selectedNode: {
          id: +action.value.node_id,
          name: `${action.value.name}`,
          is_richtxt: `${action.value.is_richtxt}`,
          createdAt: `${action.value.createdAt}`,
          updatedAt: `${action.value.updatedAt}`,
          style: JSON.parse(action.value.style),
        },
        recentNodes: [
          ...state.recentNodes.filter(
            node => +node.id !== +action.value.node_id,
          ),
          {
            id: action.value.node_id,
            name: action.value.name,
            style: action.value.style,
            is_richtxt: `${action.value.is_richtxt}`,
            createdAt: `${action.value.createdAt}`,
            updatedAt: `${action.value.updatedAt}`,
          },
        ],
      };
    case actions.SELECT_FILE:
      return {
        ...state,
        selectedFile: action.value,
        showTree: true,
        selectedNode: defaultSelectNode,
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
      };
    case actions.RELOAD_FILES:
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
