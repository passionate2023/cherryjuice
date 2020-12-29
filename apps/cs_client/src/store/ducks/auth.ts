import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  AuthUser,
  OauthSignUpCredentials,
  Secrets,
  SignInCredentials,
  SignUpCredentials,
  User,
} from '@cherryjuice/graphql-types';
import { AsyncOperation } from './document';
import { AsyncError } from '::root/components/auth/hooks/proper-error-message';
import { rootActionCreators as rac } from '::store/ducks/root';
import { cloneObj } from '@cherryjuice/shared-helpers';

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
    setResetPasswordToken: _(
      ap('set-reset-password-token'),
      _ => (token: string) => _(token),
    ),
    clearResetPasswordToken: _(ap('clear-reset-password-token')),
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
  resetPasswordToken: string;
};

const emptySettings = {
  hotKeys: { formatting: [], general: [] },
  editorSettings: { values: {} },
};
const initialState: State = {
  alert: undefined,
  token: undefined,
  user: undefined,
  secrets: undefined,
  storageType: 'localStorage',
  ongoingOperation: 'idle',
  resetPasswordToken: undefined,
  // @ts-ignore
  settings: emptySettings,
};
const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
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
      resetPasswordToken: '',
    })),
    _(
      ac.setAuthenticationInProgress,
      state =>
        ({
          ...state,
          ongoingOperation: 'in-progress',
          alert: undefined,
        } as State),
    ),
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
    _(ac.setResetPasswordToken, (state, { payload }) => ({
      ...state,
      resetPasswordToken: payload,
    })),
    _(ac.clearResetPasswordToken, state => ({
      ...state,
      resetPasswordToken: '',
    })),
  ],
  _(ac.setStorageType, (state, { payload }) => ({
    ...state,
    storageType: payload,
  })),
]);

export { reducer as authReducer, ac as authActionCreators };
