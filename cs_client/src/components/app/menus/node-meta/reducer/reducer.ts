import { NodeCached } from '::types/graphql/adapters';
import { calculateState } from '::app/menus/node-meta/helpers/calculate-state';

const initialState = {
  name: '',
  customColor: '#ffffff',
  hasCustomColor: false,
  customIcon: '0',
  hasCustomIcon: false,
  isBold: false,
  isReadOnly: false,
};

type TState = typeof initialState;

enum actions {
  setName,
  setCustomColor,
  setHasCustomColor,
  setCustomIcon,
  setHasCustomIcon,
  setIsBold,
  setIsReadOnly,
  reset,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    __setDispatch: dispatch => (state.dispatch = dispatch),
    setName: value => state.dispatch({ type: actions.setName, value }),
    setCustomColor: value =>
      state.dispatch({ type: actions.setCustomColor, value }),
    setHasCustomColor: value =>
      state.dispatch({ type: actions.setHasCustomColor, value }),
    setCustomIcon: value =>
      state.dispatch({ type: actions.setCustomIcon, value }),
    setHasCustomIcon: value =>
      state.dispatch({ type: actions.setHasCustomIcon, value }),
    setIsBold: value => state.dispatch({ type: actions.setIsBold, value }),
    setIsReadOnly: value =>
      state.dispatch({ type: actions.setIsReadOnly, value }),
    reset: (value: NodeCached) =>
      state.dispatch({ type: actions.reset, value }),
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
    case actions.setCustomColor:
      return { ...state, customColor: action.value };
    case actions.setCustomIcon:
      return { ...state, customIcon: action.value };
    case actions.setHasCustomColor:
      return { ...state, hasCustomColor: action.value };
    case actions.setHasCustomIcon:
      return { ...state, hasCustomIcon: action.value };
    case actions.setIsBold:
      return { ...state, isBold: action.value };
    case actions.setIsReadOnly:
      return { ...state, isReadOnly: action.value };
    case actions.setName:
      return { ...state, name: action.value };
    case actions.reset:
      return action.value ? calculateState(action.value) : initialState;
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as nodeMetaActionCreators,
  initialState as nodeMetaInitialState,
  reducer as nodeMetaReducer,
  TState as TNodeMetaState,
};
