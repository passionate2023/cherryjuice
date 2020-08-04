import * as React from 'react';
import { createRef, useRef } from 'react';
import { modLogin } from '::sass-modules/index';
import { Checkbox } from '::shared-components/checkbox';
import { GoogleOauthButton } from '::shared-components/buttons/google-oauth-button';
import { Icons } from '::shared-components/icon/icon';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::shared-components/form/validated-text-input';
import { FormSeparator } from '::shared-components/form/form-separator';
import { patterns } from '::auth/helpers/form-validation';
import { AuthScreen } from '::auth/auth-screen';
import { SignInCredentials } from '::types/graphql/generated';
import { LinearProgress } from '::shared-components/linear-progress';
import { Link } from 'react-router-dom';
import { openConsentWindow } from '::auth/helpers/oauth';
import { useDefaultValues } from '::hooks/use-default-form-values';
import { ac } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const inputs: ValidatedTextInputProps[] = [
  {
    label: 'username',
    icon: [Icons.material.username],
    patterns: [patterns.userName, patterns.email],
    minLength: 4,
    required: true,
    variableName: 'emailOrUsername',
    inputRef: createRef(),
    idPrefix: 'login',
  },
  {
    inputRef: createRef(),
    variableName: 'password',
    label: 'password',
    type: 'password',
    icon: [Icons.material.lock],
    required: true,
    idPrefix: 'login',
  },
];

const mapState = (state: Store) => ({
  loading: state.auth.ongoingOperation !== 'idle',
  alert: state.auth.alert,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const LoginForm: React.FC<Props & PropsFromRedux> = ({ loading, alert }) => {
  const formRef = useRef<HTMLFormElement>();
  const staySignedRef = useRef<HTMLInputElement>();
  const login = (e?: any) => {
    if (formRef.current.checkValidity()) {
      if (e) e.preventDefault();
      const variables = Object.fromEntries(
        inputs.map(({ variableName, inputRef }) => [
          variableName,
          // @ts-ignore
          inputRef?.current.value,
        ]),
      );
      ac.auth.signIn(variables as SignInCredentials);
      ac.auth.setStorageType(
        staySignedRef.current.checked ? 'localStorage' : 'sessionStorage',
      );
    }
  };

  useDefaultValues(inputs);
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    onCloseModal: () => undefined,
    onConfirmModal: login,
    focusableElementsSelector: ['a', 'input[type="submit"]', '#google-btn'],
  });
  return (
    <AuthScreen error={alert}>
      <div className={modLogin.login__card}>
        <LinearProgress loading={loading} />
        <form className={modLogin.login__form} ref={formRef}>
          <GoogleOauthButton
            onClick={openConsentWindow({
              url:
                (process.env.graphqlAPI
                  ? `http://${process.env.graphqlAPI}`
                  : '') + '/auth/google/callback',
              onAuth: ac.auth.setAuthenticationSucceeded,
            })}
          />
          <FormSeparator text={'or'} />
          {inputs.map(inputProps => (
            <ValidatedTextInput
              {...inputProps}
              key={inputProps.variableName}
              highlightInvalidInput={false}
            />
          ))}
          <span className={modLogin.login__form__rememberMe}>
            <Checkbox
              className={modLogin.login__form__rememberMe__checkbox}
              myRef={staySignedRef}
            />{' '}
            <span className={modLogin.login__form__rememberMe__text}>
              Keep me logged-in
            </span>
          </span>

          <input
            type={'submit'}
            value={'Login'}
            className={`${modLogin.login__form__input__input} ${modLogin.login__form__inputSubmit}`}
            onClick={login}
            disabled={loading}
          />
          <span className={modLogin.login__form__createAccount}>
            or{' '}
            <Link
              to="/signup"
              className={modLogin.login__form__createAccount__icon}
            >
              create an account
            </Link>
          </span>
        </form>
      </div>
    </AuthScreen>
  );
};

const _ = connector(LoginForm);
export { _ as LoginForm };
