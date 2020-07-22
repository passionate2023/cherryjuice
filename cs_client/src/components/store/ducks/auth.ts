import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  AuthUser,
  Secrets,
  SignInCredentials,
  SignUpCredentials,
  User,
} from '::types/graphql/generated';
import { AsyncOperation } from '::root/store/ducks/document';
import { ApolloError } from 'apollo-client';

const ap = createActionPrefixer('auth');

const ac = {
  ...{
    setStorageType: _(ap('set-storage-type'), _ => (storageType: StorageType) =>
      _(storageType),
    ),
    clearSession: _(ap('clear-session')),
  },
  ...{
    signIn: _(ap('sign-in'), _ => (credentials: SignInCredentials) =>
      _(credentials),
    ),
    signUp: _(ap('sign-up'), _ => (credentials: SignUpCredentials) =>
      _(credentials),
    ),
    refreshToken: _(ap('refresh-token')),
  },
  ...{
    setAuthenticationInProgress: _(ap('set-authentication-in-progress')),
    setAuthenticationFailed: _(
      ap('set-authentication-failed'),
      _ => (alert: ApolloError) => _(alert),
    ),
    setAuthenticationSucceeded: _(
      ap('set-authentication-succeeded'),
      _ => (session: AuthUser) => _(session),
    ),
  },
};

type StorageType = 'localStorage' | 'sessionStorage';
type State = {
  token: string;
  user: User;
  secrets: Secrets;
  storageType: StorageType;
  alert: ApolloError;
  ongoingOperation: AsyncOperation;
};

const initialState: State = {
  alert: undefined,
  token: undefined,
  user: undefined,
  secrets: undefined,
  storageType: 'localStorage',
  ongoingOperation: 'idle',
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(ac.setAuthenticationSucceeded, (state, { payload }) => {
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        secrets: payload.secrets,
        ongoingOperation: 'idle',
      };
    }),
    _(ac.setAuthenticationFailed, (state, { payload }) => ({
      ...state,
      alert: payload,
      ongoingOperation: 'idle',
    })),
    _(ac.setAuthenticationInProgress, state => ({
      ...state,
      ongoingOperation: 'in-progress',
    })),
  ],
  ...[
    _(ac.signIn, state => ({
      ...state,
      ongoingOperation: 'pending',
    })),
    _(ac.signUp, state => ({
      ...state,
      ongoingOperation: 'pending',
    })),
    _(ac.refreshToken, state => ({
      ...state,
      ongoingOperation: 'pending',
    })),
  ],
  ...[
    _(ac.clearSession, () => ({
      ...initialState,
    })),
    _(ac.setStorageType, (state, { payload }) => ({
      ...state,
      storageType: payload,
    })),
  ],
]);

export { reducer as authReducer, ac as authActionCreators };
