type State = {
  anchorId: string;
  valid: boolean;
  existingIDs: string[];
};

enum actions {
  resetToEdit,
  resetToCreate,
  setAnchorId,
}

export type ResetToCreateProps = Omit<State, 'valid' | 'anchorId'>;
const resetToCreate = (props: ResetToCreateProps) => ({
  ...props,
  anchorId: '',
  valid: false,
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
    setAnchorId: value => state.dispatch({ type: actions.setAnchorId, value }),
    resetToEdit: (value: ResetToEditProps) =>
      state.dispatch({ type: actions.resetToEdit, value }),
    resetToCreate: (value: ResetToCreateProps) =>
      state.dispatch({ type: actions.resetToCreate, value }),
  };
})();

const reducer = (
  state: State,
  action: {
    type: actions;
    value: any;
  },
): State => {
  switch (action.type) {
    case actions.setAnchorId:
      return {
        ...state,
        anchorId: action.value,
        valid: action.value && !state.existingIDs.includes(action.value),
      };
    case actions.resetToEdit:
      return resetToEdit(action.value);
    case actions.resetToCreate:
      return resetToCreate(action.value);
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as anchorAC,
  resetToCreate as anchorRTC,
  reducer as anchorR,
};
