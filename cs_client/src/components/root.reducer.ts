import { AuthUser, Secrets } from '::types/graphql/generated';
import { localSessionManager } from '::auth/helpers/auth-state';

const initialState: { session: AuthUser; secrets: Secrets } = {
  session: localSessionManager.get(),
  secrets: undefined,
};

type TRootState = typeof initialState & { session: AuthUser };

enum actions {
  SET_SESSION,
  SET_SECRETS,
}

const createActionCreators = () => {
  const state = {
    // eslint-disable-next-line no-unused-vars
    dispatch: props => Error('dispatcher not set'),
  };
  return {
    setDispatch: (dispatch): void => (state.dispatch = dispatch),
    setSession: (session: AuthUser) =>
      state.dispatch({ type: actions.SET_SESSION, value: session }),
    setSecrets: (secrets: Secrets) =>
      state.dispatch({ type: actions.SET_SECRETS, value: secrets }),
  };
};

const reducer = (
  state: TRootState,
  action: {
    type: actions;
    value: any;
  },
): TRootState => {
  switch (action.type) {
    case actions.SET_SESSION:
      return { ...state, session: action.value };
    case actions.SET_SECRETS:
      return { ...state, secrets: action.value };
    default:
      throw new Error('action not supported');
  }
};
const rootActionCreators = createActionCreators();
export {
  initialState as rootInitialState,
  rootActionCreators,
  reducer as rootReducer,
};
export { TRootState };
