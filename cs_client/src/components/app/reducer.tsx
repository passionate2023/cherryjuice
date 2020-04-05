const initialState = {
  showTree: JSON.parse(localStorage.getItem('showTree')) !== true,
  treeSize: JSON.parse(localStorage.getItem('treeSize')) || 250,
  selectedNode: {
    id: 0,
    name: '',
    is_richtxt: false,
    ts_creation: '',
    ts_lastsave: '',
  },
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
  error: undefined,
  showSettings: false,
  showFormattingButtons: false,
  showRecentNodes: false,
  contentEditable: false,
  isOnMobile: false,
  showInfoBar: false,
};
export type TState = typeof initialState & {
  recentNodes: { id: string; name: string; style: any }[];
  selectedNode: { id: string; name: string; style: any };
};
enum actions {
  TOGGLE_TREE,
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
  SET_ERROR,
  SET_IS_ON_MOBILE,
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
    setIsOnMobile: (isOnMobile: boolean): void => {
      state.dispatch({ type: actions.SET_IS_ON_MOBILE, value: isOnMobile });
    },
    throwError: (error: Error): void => {
      state.dispatch({ type: actions.SET_ERROR, value: error });
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
  };
};
const reducer = (state: TState, action) => {
  switch (action.type) {
    case actions.TOGGLE_TREE:
      return { ...state, showTree: !state.showTree };
    case actions.TOGGLE_FILE_SELECT:
      return { ...state, showFileSelect: !state.showFileSelect };
    case actions.RESIZE_TREE:
      return { ...state, treeSize: action.value };
    case actions.SELECT_NODE:
      (state.recentNodes.some(node => +node.id === +action.value.node_id)
        ? state.recentNodes.filter(node => +node.id !== +action.value.node_id)
        : state.recentNodes
      ).push({
        id: action.value.node_id,
        name: action.value.name,
        style: action.value.style,
      });

      return {
        ...state,
        selectedNode: {
          id: +action.value.node_id,
          name: `${action.value.name}`,
          is_richtxt: `${action.value.is_richtxt}`,
          ts_creation: `${action.value.ts_creation}`,
          ts_lastsave: `${action.value.ts_lastsave}`,
          style: JSON.parse(action.value.style),
        },
        recentNodes: [...state.recentNodes],
      };
    case actions.SELECT_FILE:
      return {
        ...state,
        selectedFile: action.value,
        showFileSelect: !action.value,
        showTree: true,
        selectedNode: { id: -1, name: '' },
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
    case actions.SET_ERROR:
      // if (state.error === action.value) return state;
      return {
        ...state,
        error: action.value,
      };
    case actions.TOGGLE_SETTINGS:
      return { ...state, showSettings: !state.showSettings };
    case actions.TOGGLE_RECENT_NODES_BAR:
      return {
        ...state,
        showRecentNodes: !state.showRecentNodes,
        showFormattingButtons: false,
      };
    case actions.TOGGLE_FORMATTING_BUTTONS:
      return {
        ...state,
        showFormattingButtons: !state.showFormattingButtons,
        showRecentNodes: false,
      };
    case actions.TOGGLE_CONTENT_EDITABLE:
      return { ...state, contentEditable: !state.contentEditable };
    case actions.TOGGLE_INFO_BAR:
      return { ...state, showInfoBar: !state.showInfoBar };
    case actions.SET_IS_ON_MOBILE:
      return { ...state, isOnMobile: action.value };
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
