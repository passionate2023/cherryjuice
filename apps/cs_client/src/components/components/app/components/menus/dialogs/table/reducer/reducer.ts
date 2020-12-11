import { TableProperties } from '@cherryjuice/editor/types/helpers/objects/insert-object';

type State = {
  valid: boolean;
  values: TableProperties;
};

enum actions {
  resetToEdit,
  resetToCreate,
  setRows,
  setColumns,
}

export type ResetToCreateProps = {};
const resetToCreate = (): State => ({
  valid: true,
  values: {
    rows: 4,
    columns: 4,
  },
});
export type ResetToEditProps = TableProperties;
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
    setRows: (value: string) =>
      state.dispatch({ type: actions.setRows, value: +value }),
    setColumns: (value: string) =>
      state.dispatch({ type: actions.setColumns, value: +value }),
    resetToEdit: (value: ResetToEditProps) =>
      state.dispatch({ type: actions.resetToEdit, value }),
    resetToCreate: () => state.dispatch({ type: actions.resetToCreate }),
  };
})();

const stateIsValid = (state: State): boolean => {
  if (!state.values.rows || !state.values.columns) return false;
  if (
    typeof state.values.rows !== 'number' ||
    typeof state.values.columns !== 'number'
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
    case actions.setRows:
      newState = {
        ...state,
        values: {
          ...state.values,
          rows: action.value,
        },
      };
      break;
    case actions.setColumns:
      newState = {
        ...state,
        values: {
          ...state.values,
          columns: action.value,
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
  actionCreators as tableAC,
  resetToCreate as tableRTC,
  reducer as tableR,
  State as TableState,
};
