/* eslint-disable no-console */
import * as React from 'react';
import { modAuthBanner, modLogin } from '::sass-modules/index';
import { ICON_COLOR, Icons } from '::shared-components/icon';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { TextInput, TextInputProps } from '::shared-components/form/text-input';
import { patterns } from '::auth/helpers/form-validation';
import { useMutation } from '@apollo/react-hooks';
import { USER_MUTATION } from '::graphql/mutations';
import { AuthScreen } from '::auth/auth-screen';
import { createRef, useEffect, useRef } from 'react';
import { AuthUser } from '::types/graphql/generated';
import { LinearProgress } from '::shared-components/linear-progress';
import { Banner } from '::auth/banner';
import { Link } from 'react-router-dom';
import { rootActionCreators } from '::root/root.reducer';
import { useDefaultValues } from '::hooks/use-default-form-values';

const inputs: TextInputProps[] = [
  {
    label: 'first name',
    icon: [Icons.material['person-circle'], ICON_COLOR.black],
    patterns: [patterns.name],
    minLength: 2,
    required: true,
    variableName: 'firstName',
    inputRef: createRef(),
    idPrefix: 'sign-up',
  },
  {
    label: 'last name',
    icon: [Icons.material['person-circle'], ICON_COLOR.black],
    patterns: [patterns.name],
    minLength: 2,
    required: true,
    variableName: 'lastName',
    inputRef: createRef(),
    idPrefix: 'sign-up',
  },
  {
    label: 'username',
    icon: [Icons.material.username, ICON_COLOR.black],
    patterns: [patterns.userName],
    minLength: 4,
    required: true,
    variableName: 'username',
    inputRef: createRef(),
    idPrefix: 'sign-up',
  },
  {
    label: 'email',
    icon: [Icons.material.email, ICON_COLOR.black],
    type: 'email',
    required: true,
    variableName: 'email',
    inputRef: createRef(),
    idPrefix: 'sign-up',
  },
  {
    inputRef: createRef(),
    variableName: 'password',
    patterns: [patterns.password],
    label: 'password',
    type: 'password',
    icon: [Icons.material.lock, ICON_COLOR.black],
    minLength: 8,
    required: true,
    idPrefix: 'sign-up',
  },
];

type Props = {
  session: AuthUser;
};
const SignUpForm: React.FC<Props> = () => {
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    onCloseModal: () => undefined,
    focusableElementsSelector: ['a', 'input[type="submit"]'],
  });
  const [mutate, { loading, error, data }] = useMutation(
    USER_MUTATION.signUp.query,
  );
  const formRef = useRef<HTMLFormElement>();
  const signUp = e => {
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

  useEffect(() => {
    const session = USER_MUTATION.signUp.path(data);
    if (session?.token) rootActionCreators.setSession(session);
  }, [data]);
  useDefaultValues(inputs);
  return (
    <AuthScreen>
      <Banner error={error} className={modAuthBanner.bannerSignUp} />
      <div className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}>
        <LinearProgress loading={loading} />
        <form className={modLogin.login__form} ref={formRef}>
          {inputs.map(inputProps => (
            <TextInput {...inputProps} key={inputProps.variableName} />
          ))}

          <input
            type={'submit'}
            value={'Sign up'}
            className={`${modLogin.login__form__input__input} ${modLogin.login__form__inputSubmit}`}
            onClick={signUp}
            disabled={loading}
            style={{ marginTop: 20 }}
          />
          <span className={modLogin.login__form__createAccount}>
            already a member?{' '}
            <Link
              to="/login"
              className={modLogin.login__form__createAccount__icon}
            >
              log in
            </Link>
          </span>
        </form>
      </div>
    </AuthScreen>
  );
};

export { SignUpForm };
