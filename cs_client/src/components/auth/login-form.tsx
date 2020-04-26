/* eslint-disable no-console */
import * as React from 'react';
import { createRef, useEffect, useRef } from 'react';
import { modLogin } from '::sass-modules/index';
import { Checkbox } from '::shared-components/checkbox';
import { GoogleOauthButton } from '::shared-components/buttons/google-oauth-button';
import {  Icons } from '::shared-components/icon';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { TextInput, TextInputProps } from '::shared-components/form/text-input';
import { FormSeparator } from '::shared-components/form/form-separator';
import { patterns } from '::auth/helpers/form-validation';
import { useMutation } from '@apollo/react-hooks';
import { USER_MUTATION } from '::graphql/mutations';
import { AuthScreen } from '::auth/auth-screen';
import { AuthUser } from '::types/graphql/generated';
import { LinearProgress } from '::shared-components/linear-progress';
import { Banner } from '::auth/banner';
import { Link } from 'react-router-dom';

const inputs: TextInputProps[] = [
  {
    label: 'username',
    icon: Icons.misc.username,
    patterns: [patterns.userName, patterns.email],
    minLength: 4,
    required: true,
    variableName: 'emailOrUsername',
    inputRef: createRef(),
  },
  {
    inputRef: createRef(),
    variableName: 'password',
    label: 'password',
    type: 'password',
    icon: Icons.misc.lock,
    required: true,
  },
];

type Props = {
  setSession: Function;
  session: AuthUser;
};
const LoginForm: React.FC<Props> = ({ setSession }) => {
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    onCloseModal: () => undefined,
    focusableElementsSelector: ['a', 'input[type="submit"]', '#google-btn'],
  });
  const [mutate, { loading, error, data }] = useMutation(
    USER_MUTATION.signIn.query,
  );
  const formRef = useRef<HTMLFormElement>();
  const login = e => {
    if (formRef.current.checkValidity()) {
      e.preventDefault();
      const variables = Object.fromEntries(
        inputs.map(({ variableName, inputRef }) => [
          variableName,
          inputRef?.current.value,
        ]),
      );
      mutate({
        variables: {
          input: variables,
        },
      });
    }
  };

  useEffect(() => {
    const session = USER_MUTATION.signIn.path(data);
    if (session?.token) setSession(session);
  }, [data]);

  return (
    <AuthScreen>
      <div className={modLogin.login__card}>
        <Banner message={error?.graphQLErrors[0]?.message} />
        <LinearProgress loading={loading} />
        <form className={modLogin.login__form} ref={formRef}>
          <GoogleOauthButton
            onClick={() => console.log('redirecting to google')}
          />
          <FormSeparator text={'or'} />
          {inputs.map(inputProps => (
            <TextInput {...inputProps} key={inputProps.variableName} />
          ))}
          <span className={modLogin.login__form__rememberMe}>
            <Checkbox className={modLogin.login__form__rememberMe__checkbox} />{' '}
            <span className={modLogin.login__form__rememberMe__text}>
              Stay signed
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

export { LoginForm };
