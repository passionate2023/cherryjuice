type State = {
  selected: number;
};

enum actions {
  selectNode,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    init: dispatch => (state.dispatch = dispatch),
    selectNode: (selected: number) =>
      state.dispatch({ type: actions.selectNode, value: selected }),
  };
})();

const reducer = (
  state: State,
  action: {
    type: actions;
    value: any;
  },
): State => {
  let newState;
  switch (action.type) {
    case actions.selectNode:
      newState = {
        ...state,
        selected: action.value,
      };
      break;
    default:
      throw new Error(action.type + ' action not supported');
  }
  return newState;
};

export { actionCreators as editorAC, reducer as editorR, State as EditorState };
