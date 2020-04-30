import * as React from 'react';
import { createRef, useEffect, useRef } from 'react';
import { modLogin } from '::sass-modules/index';
import { Checkbox } from '::shared-components/checkbox';
import { GoogleOauthButton } from '::shared-components/buttons/google-oauth-button';
import { Icons } from '::shared-components/icon';
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
import { openConsentWindow } from '::auth/helpers/oauth';
import { useDefaultValues } from '::hooks/use-default-form-values';
import { localSessionManager } from '::auth/helpers/auth-state';
import { rootActionCreators } from '::root/root.reducer';

const inputs: TextInputProps[] = [
  {
    label: 'username',
    icon: Icons.misc.username,
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
    icon: Icons.misc.lock,
    required: true,
    idPrefix: 'login',
  },
];

type Props = {
  session: AuthUser;
};

const LoginForm: React.FC<Props> = () => {
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
          // @ts-ignore
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

  const staySignedRef = useRef<HTMLInputElement>();
  useEffect(() => {
    const session = USER_MUTATION.signIn.path(data);
    if (session?.token) {
      localSessionManager.setStorageType(staySignedRef.current.checked);
      rootActionCreators.setSession(session);
    }
  }, [data]);

  useDefaultValues(inputs);
  return (
    <AuthScreen>
      <div className={modLogin.login__card}>
        <Banner message={error?.graphQLErrors[0]?.message} />
        <LinearProgress loading={loading} />
        <form className={modLogin.login__form} ref={formRef}>
          <GoogleOauthButton
            onClick={openConsentWindow({
              url:
                (`http://${process.env.graphqlAPI}` || '') +
                '/auth/google/callback',
              onAuth: rootActionCreators.setSession,
            })}
          />
          <FormSeparator text={'or'} />
          {inputs.map(inputProps => (
            <TextInput {...inputProps} key={inputProps.variableName} />
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

export { LoginForm };
