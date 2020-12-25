type State = {
  ready: boolean;
  showLoader: boolean;
};

enum actions {
  setReady,
  showLoader,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    init: dispatch => (state.dispatch = dispatch),
    setReady: (ready: true) =>
      state.dispatch({ type: actions.setReady, value: ready }),
    showLoader: (show: true) =>
      state.dispatch({ type: actions.showLoader, value: show }),
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
    case actions.showLoader:
      newState = {
        ...state,
        showLoader: true,
      };
      break;
    default:
      throw new Error(action.type + ' action not supported');
  }
  return newState;
};

export { actionCreators as rootAC, reducer as rootR, State as RootState };
