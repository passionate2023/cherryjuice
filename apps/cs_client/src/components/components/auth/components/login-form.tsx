import * as React from 'react';
import { createRef, useRef } from 'react';
import { modLogin } from '::sass-modules';
import { Checkbox } from '::root/components/shared-components/form/checkbox';
import { GoogleOauthButton } from '::root/components/shared-components/buttons/google-oauth-button';
import { Icons } from '::root/components/shared-components/icon/icon';
import { useModalKeyboardEvents } from '::hooks/modals/close-modal/use-modal-keyboard-events';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { FormSeparator } from '::root/components/shared-components/form/form-separator';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { SignInCredentials } from '@cherryjuice/graphql-types';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { Link } from 'react-router-dom';
import { openConsentWindow } from '::root/components/auth/helpers/oauth';
import { useDefaultValues } from '::hooks/use-default-form-values';
import { ac } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { uri } from '::graphql/client/hooks/apollo-client';

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
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const LoginForm: React.FC<Props & PropsFromRedux> = ({ loading }) => {
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
  const keyboardEventsProps = useModalKeyboardEvents({
    dismiss: () => undefined,
    confirm: login,
    focusableElementsSelector: ['a', 'input[type="submit"]', '#google-btn'],
  });
  return (
    <div
      {...keyboardEventsProps}
      className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}
    >
      <LinearProgress loading={loading} />
      <form className={modLogin.login__form} ref={formRef}>
        <GoogleOauthButton
          onClick={openConsentWindow({
            url: uri.httpBase + '/auth/google/callback',
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
            keep me logged-in
          </span>
          <Link
            to="/auth/forgot-password"
            className={modLogin.login__form__rememberMe__text}
          >
            forgot password
          </Link>
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
            to="/auth/signup"
            className={modLogin.login__form__createAccount__icon}
          >
            create an account
          </Link>
        </span>
      </form>
    </div>
  );
};

const _ = connector(LoginForm);
export { _ as LoginForm };
