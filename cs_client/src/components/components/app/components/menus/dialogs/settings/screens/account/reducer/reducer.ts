export type ValidatedInputState = { value: string; valid: boolean };

export const primitiveStateToValidatedState = (
  primitiveState: PrimitiveState,
): State =>
  Object.fromEntries(
    Object.entries(primitiveState).map(([k, v]) => [
      k,
      { value: v, valid: true },
    ]),
  ) as State;

type PrimitiveState = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

type State = {
  firstName: ValidatedInputState;
  lastName: ValidatedInputState;
  email: ValidatedInputState;
  username: ValidatedInputState;
  newPassword?: ValidatedInputState;
  newPasswordConfirmation?: ValidatedInputState;
};

enum actions {
  setFirstName,
  setLastName,
  setUserName,
  setNewPassword,
  setNewPasswordConfirmation,
  reset,
  setEmail,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    __setDispatch: dispatch => (state.dispatch = dispatch),
    setFirstName: (value: ValidatedInputState) =>
      state.dispatch({ type: actions.setFirstName, value }),
    setLastName: (value: ValidatedInputState) =>
      state.dispatch({ type: actions.setLastName, value }),
    setNewPassword: (value: ValidatedInputState) =>
      state.dispatch({ type: actions.setNewPassword, value }),
    setNewPasswordConfirmation: (value: ValidatedInputState) =>
      state.dispatch({ type: actions.setNewPasswordConfirmation, value }),
    setUserName: (value: ValidatedInputState) =>
      state.dispatch({ type: actions.setUserName, value }),
    setEmail: (value: ValidatedInputState) =>
      state.dispatch({ type: actions.setEmail, value }),
    reset(value: PrimitiveState) {
      state.dispatch({ type: actions.reset, value });
    },
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
    case actions.setFirstName:
      return { ...state, firstName: action.value };
    case actions.setLastName:
      return { ...state, lastName: action.value };
    case actions.setUserName:
      return { ...state, username: action.value };
    case actions.setNewPassword:
      return { ...state, newPassword: action.value };
    case actions.setEmail:
      return { ...state, email: action.value };
    case actions.setNewPasswordConfirmation:
      return { ...state, newPasswordConfirmation: action.value };
    case actions.reset:
      return {
        ...primitiveStateToValidatedState(action.value),
        newPassword: { value: '', valid: false },
        newPasswordConfirmation: { value: '', valid: false },
      };
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as userSettingsActionCreators,
  reducer as userSettingsReducer,
  State as TUserSettingsMetaState,
};
