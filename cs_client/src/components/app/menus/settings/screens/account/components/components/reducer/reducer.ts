type State = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
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
    setFirstName: (value: string) =>
      state.dispatch({ type: actions.setFirstName, value }),
    setLastName: (value: string) =>
      state.dispatch({ type: actions.setLastName, value }),
    setNewPassword: (value: string) =>
      state.dispatch({ type: actions.setNewPassword, value }),
    setNewPasswordConfirmation: (value: string) =>
      state.dispatch({ type: actions.setNewPasswordConfirmation, value }),
    setUserName: (value: string) =>
      state.dispatch({ type: actions.setUserName, value }),
    setEmail: (value: string) =>
      state.dispatch({ type: actions.setEmail, value }),
    reset(value: Omit<State, 'newPassword' | 'newPasswordConfirmation'>) {
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
      return { ...action.value, newPassword: '', newPasswordConfirmation: '' };
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as userSettingsActionCreators,
  reducer as userSettingsReducer,
  State as TUserSettingsMetaState,
};
