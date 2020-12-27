import * as React from 'react';
import { createRef, useRef } from 'react';
import { modLogin } from '::sass-modules';
import { GoogleOauthButton } from '@cherryjuice/components';
import { Icons } from '@cherryjuice/icons';
import { useModalKeyboardEvents } from '@cherryjuice/shared-helpers';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '@cherryjuice/components';
import { FormSeparator } from '::auth/components/shared-components/form-separator/form-separator';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { SignInCredentials } from '@cherryjuice/graphql-types';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { Link } from '::auth/components/shared-components/link/link';
import { openConsentWindow } from '::root/components/auth/helpers/oauth';
import { useDefaultValues } from '::hooks/use-default-form-values';
import { ac } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { uri } from '::graphql/client/hooks/apollo-client';
import { SubmitButton } from '::auth/components/shared-components/submit-buttton/submit-button';
import { FormCheckbox } from '::auth/components/shared-components/form-checkbox/form-checkbox';

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

export const authFormFocusableElements = [
  'input',
  'span[tabindex="0"]',
  'input[type="submit"]',
  '#google-btn',
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
    focusableElementsSelector: authFormFocusableElements,
  });
  return (
    <div
      {...keyboardEventsProps}
      className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}
    >
      <LinearProgress loading={loading} />
      <form className={modLogin.loginForm} ref={formRef}>
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
        <span className={modLogin.loginForm__middleSection}>
          <FormCheckbox _ref={staySignedRef} text={'keep me logged-in'} />
          <Link
            to="/auth/forgot-password"
            text={'forgot password'}
            decorated={false}
          />
        </span>

        <SubmitButton
          text={'Login'}
          onClick={login}
          disabled={loading}
          noMarginTop={true}
        />
        <span className={modLogin.loginForm__bottomSection}>
          <span>or </span>
          <Link to="/auth/signup" text={'create an account'} />
        </span>
      </form>
    </div>
  );
};

const _ = connector(LoginForm);
export { _ as LoginForm };
