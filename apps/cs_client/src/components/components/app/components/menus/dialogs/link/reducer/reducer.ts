export enum LinkType {
  LOCAL_NODE = 'node',
  WEB_SITE = 'web',
  FOLDER = 'folder',
  FILE = 'file',
}
type State = {
  valid: boolean;
  url: string;
  type: LinkType;
  node_id: string;
  anchorId: string;
  location: string;
};

enum actions {
  resetToEdit,
  resetToCreate,
  setUrl,
  setLinkType,
  setNodeId,
  setAnchorId,
  setLocation,
}

export type ResetToCreateProps = {};
const resetToCreate = (): State => ({
  url: '',
  valid: false,
  type: LinkType.WEB_SITE,
  anchorId: '',
  node_id: '',
  location: '',
});
export type ResetToEditProps = Omit<State, 'valid'>;
const resetToEdit = (props: ResetToEditProps) => ({
  ...props,
  valid: false,
});

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    init: dispatch => (state.dispatch = dispatch),
    setUrl: (link: string) =>
      state.dispatch({ type: actions.setUrl, value: link }),
    setLinkType: (type: LinkType) =>
      state.dispatch({ type: actions.setLinkType, value: type }),
    setNodeId: (value: string) =>
      state.dispatch({ type: actions.setNodeId, value }),
    setLocation: (value: string) =>
      state.dispatch({ type: actions.setLocation, value }),
    setAnchorId: (value: string) =>
      state.dispatch({ type: actions.setAnchorId, value }),
    resetToEdit: (value: ResetToEditProps) =>
      state.dispatch({ type: actions.resetToEdit, value }),
    resetToCreate: () => state.dispatch({ type: actions.resetToCreate }),
  };
})();

const stateIsValid = (state: State): boolean => {
  if (
    state.type === LinkType.WEB_SITE &&
    (!state.url || !state.url.startsWith('http'))
  )
    return false;
  if (
    state.type === LinkType.LOCAL_NODE &&
    (!state.node_id || isNaN(Number(state.node_id)))
  )
    return false;
  if (
    (state.type === LinkType.FILE || state.type === LinkType.FOLDER) &&
    !state.location
  )
    return false;
  return true;
};

const reducer = (
  state: State,
  action: {
    type: actions;
    value: any;
  },
): State => {
  let newState;
  switch (action.type) {
    case actions.setUrl:
      newState = {
        ...state,
        url: action.value,
      };
      break;
    case actions.setLocation:
      newState = {
        ...state,
        location: action.value,
      };
      break;
    case actions.setNodeId:
      newState = {
        ...state,
        node_id: action.value,
      };
      break;
    case actions.setAnchorId:
      newState = {
        ...state,
        anchorId: action.value,
      };
      break;
    case actions.setLinkType:
      newState = {
        ...state,
        type: action.value,
        valid: stateIsValid(state),
      };
      break;
    case actions.resetToEdit:
      return resetToEdit(action.value);
    case actions.resetToCreate:
      return resetToCreate();
    default:
      throw new Error(action.type + ' action not supported');
  }
  newState.valid = stateIsValid(newState);
  return newState;
};

export {
  actionCreators as linkAC,
  resetToCreate as linkRTC,
  reducer as linkR,
  State as LinkState,
};
