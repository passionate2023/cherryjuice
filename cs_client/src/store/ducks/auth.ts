import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  AuthUser,
  OauthSignUpCredentials,
  Secrets,
  SignInCredentials,
  SignUpCredentials,
  User,
} from '::types/graphql/generated';
import { AsyncOperation } from './document';
import { rootActionCreators } from './root';
import { AsyncError } from '::root/components/auth/hooks/proper-error-message';

const ap = createActionPrefixer('auth');

const ac = {
  ...{
    setStorageType: _(ap('set-storage-type'), _ => (storageType: StorageType) =>
      _(storageType),
    ),
  },
  ...{
    signIn: _(ap('sign-in'), _ => (credentials: SignInCredentials) =>
      _(credentials),
    ),
    signUp: _(
      ap('sign-up'),
      _ => (
        credentials: SignUpCredentials | OauthSignUpCredentials,
        oauth = false,
      ) => _(credentials, { oauth }),
    ),

    refreshToken: _(ap('refresh-token')),
    deleteAccount: _(ap('delete-account')),
  },
  ...{
    setAuthenticationInProgress: _(ap('set-authentication-in-progress')),
    setAuthenticationFailed: _(
      ap('set-authentication-failed'),
      _ => (alert: AsyncError) => _(alert),
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
  alert: AsyncError;
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
      alert: undefined
    } as State)),
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
    _(rootActionCreators.resetState, () => ({
      ...initialState,
    })),
    _(ac.setStorageType, (state, { payload }) => ({
      ...state,
      storageType: payload,
    })),
  ],
]);

export { reducer as authReducer, ac as authActionCreators };
