import { calculateState } from './helpers/calculate-state';

const initialState = {
  name: 'new document',
};

type TState = typeof initialState;

enum actions {
  setName,
  reset,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    __setDispatch: dispatch => (state.dispatch = dispatch),
    setName: value => state.dispatch({ type: actions.setName, value }),
    reset: (value?: TState) => state.dispatch({ type: actions.reset, value }),
  };
})();

const reducer = (
  state: TState,
  action: {
    type: actions;
    value: any;
  },
): TState => {
  switch (action.type) {
    case actions.setName:
      return { ...state, name: action.value };
    case actions.reset:
      return action.value ? calculateState(action.value) : initialState;
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as documentMetaActionCreators,
  initialState as documentMetaInitialState,
  reducer as documentMetaReducer,
  TState as TDocumentMetaState,
};
