const initialState = {
  showTree: JSON.parse(localStorage.getItem('showTree')) !== false,
  treeSize: JSON.parse(localStorage.getItem('treeSize')) || 250,
  selectedNode: {
    id: 0,
    name: '',
    is_richtxt: false,
    ts_creation: '',
    ts_lastsave: '',
  },
  selectedFile: localStorage.getItem('selectedFile'),
  showFileSelect:
    !localStorage.getItem('selectedFile') && location.pathname === '/',
  recentNodes: [], //recentNodes ? { [selectedNode]: recentNodes[selectedNode] } : {}
  saveDocument: 0,
  reloadDocument: 0,
  error: undefined,
  showSettings: true,
};
export type TState = typeof initialState;
const actions = {
  TOGGLE_TREE: 'toggle-tree',
  TOGGLE_FILE_SELECT: 'show-select-file',
  RESIZE_TREE: 'resize-tree',
  SELECT_NODE: 'select-node',
  SELECT_FILE: 'select-file',
  SAVE_DOCUMENT: 'save-document',
  RELOAD_DOCUMENT: 'reload-document',
  SET_ERROR: 'set-error',
  TOGGLE_SETTINGS: 'TOGGLE_SETTINGS',
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
    case actions.SET_ERROR:
      return {
        ...state,
        error: action.value,
      };
    case actions.TOGGLE_SETTINGS:
      return { ...state, showSettings: !state.showSettings };
    default:
      throw new Error('action not supported');
  }
};

export {
  initialState as appInitialState,
  reducer as appReducer,
  actions as appActions,
};
