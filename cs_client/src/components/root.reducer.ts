import { AuthUser, Secrets } from '::types/graphql/generated';
import { localSessionManager } from '::auth/helpers/auth-state';
import { ApolloClient } from 'apollo-client';
const initialState: {
  session: AuthUser;
  secrets: Secrets;
  apolloClient: ApolloClient<any>;
} = {
  session: localSessionManager.get(),
  secrets: undefined,
  apolloClient: undefined,
};

type TRootState = typeof initialState & { session: AuthUser };

enum actions {
  SET_SESSION,
  SET_SECRETS,
  SET_APOLLO_CLIENT,
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
    setApolloClient: (client: ApolloClient<any>) => {
      state.dispatch({ type: actions.SET_APOLLO_CLIENT, value: client });
    },
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
    case actions.SET_APOLLO_CLIENT:
      return { ...state, apolloClient: action.value };
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
