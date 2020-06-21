/* eslint-disable no-console */
import * as React from 'react';
import { modLogin } from '::sass-modules/index';
import { Icons } from '::shared-components/icon/icon';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { TextInput, TextInputProps } from '::shared-components/form/text-input';
import { patterns } from '::auth/helpers/form-validation';
import { useMutation } from '@apollo/react-hooks';
import { USER_MUTATION } from '::graphql/mutations';
import { AuthScreen } from '::auth/auth-screen';
import { createRef, useEffect, useRef } from 'react';
import { AuthUser } from '::types/graphql/generated';
import { LinearProgress } from '::shared-components/linear-progress';
import { Link } from 'react-router-dom';
import { rootActionCreators } from '::root/root.reducer';
import { useDefaultValues } from '::hooks/use-default-form-values';

const inputs: TextInputProps[] = [
  {
    label: 'first name',
    icon: [Icons.material['person-circle']],
    patterns: [patterns.name],
    minLength: 2,
    required: true,
    variableName: 'firstName',
    inputRef: createRef(),
    idPrefix: 'sign-up',
  },
  {
    label: 'last name',
    icon: [Icons.material['person-circle']],
    patterns: [patterns.name],
    minLength: 2,
    required: true,
    variableName: 'lastName',
    inputRef: createRef(),
    idPrefix: 'sign-up',
  },
  {
    label: 'username',
    icon: [Icons.material.username],
    patterns: [patterns.userName],
    minLength: 4,
    required: true,
    variableName: 'username',
    inputRef: createRef(),
    idPrefix: 'sign-up',
  },
  {
    label: 'email',
    icon: [Icons.material.email],
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
    icon: [Icons.material.lock],
    minLength: 8,
    required: true,
    idPrefix: 'sign-up',
  },
];

type Props = {
  session: AuthUser;
};
const SignUpForm: React.FC<Props> = () => {
  const [mutate, { loading, error, data }] = useMutation(
    USER_MUTATION.signUp.query,
  );
  const formRef = useRef<HTMLFormElement>();
  const signUp = (e?: any) => {
    if (formRef.current.checkValidity()) {
      if (e) e.preventDefault();
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
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    focusableElementsSelector: ['a', 'input[type="submit"]'],
    onCloseModal: () => undefined,
    onConfirmModal: signUp,
  });
  return (
    <AuthScreen error={error}>
      <div className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}>
        <LinearProgress loading={loading} />
        <form className={modLogin.login__form} ref={formRef}>
          {inputs.map(inputProps => (
            <TextInput {...inputProps} key={inputProps.variableName} />
          ))}

          <input
            type={'submit'}
            value={'Sign up'}
            className={`${modLogin.login__form__inputSubmit} ${modLogin.login__form__input__input} `}
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
