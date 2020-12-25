type State = {
  ready: boolean;
};

enum actions {
  setReady,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    init: dispatch => (state.dispatch = dispatch),
    setReady: (ready: true) =>
      state.dispatch({ type: actions.setReady, value: ready }),
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
    case actions.setReady:
      newState = {
        ...state,
        ready: true,
      };
      break;
    default:
      throw new Error(action.type + ' action not supported');
  }
  return newState;
};

export { actionCreators as rootAC, reducer as rootR, State as RootState };
