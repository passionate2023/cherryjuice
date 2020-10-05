export type CodeboxProperties = {
  width: number;
  widthType: 'pixels' | '%';
  height: number;
  autoExpandHeight: 'fixed' | 'auto';
};
type State = {
  valid: boolean;
  values: CodeboxProperties;
};

enum actions {
  resetToEdit,
  resetToCreate,
  setHeight,
  setWidth,
  setWidthType,
  setAutoExpandHeight,
}

export type ResetToCreateProps = {};
const resetToCreate = (): State => ({
  valid: true,
  values: {
    autoExpandHeight: 'fixed',
    height: 500,
    width: 400,
    widthType: 'pixels',
  },
});
export type ResetToEditProps = CodeboxProperties;
const resetToEdit = (props: ResetToEditProps) => ({
  values: props,
  valid: true,
});

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    init: dispatch => (state.dispatch = dispatch),
    setWidth: (value: string) =>
      state.dispatch({ type: actions.setWidth, value: +value }),
    setHeight: (value: string) =>
      state.dispatch({ type: actions.setHeight, value: +value }),
    setAutoExpandHeight: (value: string) =>
      state.dispatch({ type: actions.setAutoExpandHeight, value: value }),
    setWidthType: (value: string) =>
      state.dispatch({ type: actions.setWidthType, value: value }),
    resetToEdit: (value: ResetToEditProps) =>
      state.dispatch({ type: actions.resetToEdit, value }),
    resetToCreate: () => state.dispatch({ type: actions.resetToCreate }),
  };
})();

const stateIsValid = (state: State): boolean => {
  if (!state.values.width || !state.values.height) return false;
  if (
    typeof state.values.width !== 'number' ||
    typeof state.values.height !== 'number'
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
  let newState: State;
  switch (action.type) {
    case actions.setWidth:
      newState = {
        ...state,
        values: {
          ...state.values,
          width: action.value,
        },
      };
      break;
    case actions.setHeight:
      newState = {
        ...state,
        values: {
          ...state.values,
          height: action.value,
        },
      };
      break;
    case actions.setWidthType:
      newState = {
        ...state,
        values: {
          ...state.values,
          widthType: action.value,
        },
      };
      break;
    case actions.setAutoExpandHeight:
      newState = {
        ...state,
        values: {
          ...state.values,
          autoExpandHeight: action.value,
        },
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
  actionCreators as codeboxAC,
  resetToCreate as codeboxRTC,
  reducer as codeboxR,
  State as CodeboxState,
};
