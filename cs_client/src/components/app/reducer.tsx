import { getSelectedNodeFromRoute } from '::helpers/misc';
import { act } from 'react-dom/test-utils';

const selectedNode = getSelectedNodeFromRoute({ pathname: location.pathname });
const recentNodes = JSON.parse(localStorage.getItem('recentNodes'));
console.log({ recentNodes });
const initialState = {
  showTree: JSON.parse(localStorage.getItem('showTree')),
  treeSize: JSON.parse(localStorage.getItem('treeSize')) || 250,
  selectedNode: {
    id: 0,
    name: '',
    is_richtxt: false,
    ts_creation: '',
    ts_lastsave: ''
  },
  selectedFile: localStorage.getItem('selectedFile'),
  showFileSelect: !Boolean(localStorage.getItem('selectedFile')),
  recentNodes: [], //recentNodes ? { [selectedNode]: recentNodes[selectedNode] } : {}
  serverSideHtml: true
};
export type TState = typeof initialState;
const actions = {
  TOGGLE_TREE: 'toggle-tree',
  TOGGLE_FILE_SELECT: 'show-select-file',
  RESIZE_TREE: 'resize-tree',
  SELECT_NODE: 'select-node',
  SELECT_FILE: 'select-file',
  TOGGLE_SERVER_SIDE_HTML: 'ssr',
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
      // if (+state.selectedNode.id !== +action.value.node_id)
      console.log('new ad', { action, state });
      (state.recentNodes.some(node => +node.id === +action.value.node_id)
        ? state.recentNodes.filter(node => +node.id !== +action.value.node_id)
        : state.recentNodes
      ).push({
        id: action.value.node_id,
        name: action.value.name
      });

      return {
        ...state,
        selectedNode: {
          id: +action.value.node_id,
          name: `${action.value.name}`,
          is_richtxt: `${action.value.is_richtxt}`,
          ts_creation: `${action.value.ts_creation}`,
          ts_lastsave: `${action.value.ts_lastsave}`
        },
        recentNodes: [...state.recentNodes]
      };
    case actions.SELECT_FILE:
      return {
        ...state,
        selectedFile: action.value,
        showFileSelect: !action.value,
        showTree: true,
        selectedNode: { id: -1, name: '' }
      };
    case actions.TOGGLE_SERVER_SIDE_HTML:
      return { ...state, serverSideHtml: !state.serverSideHtml };
    default:
      throw new Error('action not supported');
  }
};

export {
  initialState as appInitialState,
  reducer as appReducer,
  actions as appActions
};
