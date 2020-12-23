/* eslint-disable no-console */
import * as React from 'react';
import { modLogin } from '::sass-modules';
import { Icons } from '@cherryjuice/icons';
import { useModalKeyboardEvents } from '@cherryjuice/shared-helpers';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { createRef, useRef } from 'react';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { SignUpCredentials } from '@cherryjuice/graphql-types';
import { useDefaultValues } from '::hooks/use-default-form-values';

export const ReturnToLoginPage: React.FC<{
  text?: string;
  linkText?: string;
}> = ({ text, linkText }) => (
  <span
    className={modLogin.login__form__createAccount}
    onClick={ac.root.resetState}
  >
    {text || 'already a member?'}{' '}
    <Link
      to="/auth/login"
      className={modLogin.login__form__createAccount__icon}
    >
      {linkText || 'log in'}
    </Link>
  </span>
);

const idPrefix = 'sign-up';
const inputs: ValidatedTextInputProps[] = [
  {
    label: 'first name',
    icon: [Icons.material['person-circle']],
    patterns: [patterns.name],
    minLength: 2,
    required: true,
    variableName: 'firstName',
    inputRef: createRef(),
    idPrefix,
  },
  {
    label: 'last name',
    icon: [Icons.material['person-circle']],
    patterns: [patterns.name],
    minLength: 2,
    required: true,
    variableName: 'lastName',
    inputRef: createRef(),
    idPrefix,
  },
  {
    label: 'username',
    icon: [Icons.material.username],
    patterns: [patterns.userName],
    minLength: 4,
    required: true,
    variableName: 'username',
    inputRef: createRef(),
    idPrefix,
  },
  {
    label: 'email',
    icon: [Icons.material.email],
    type: 'email',
    required: true,
    variableName: 'email',
    inputRef: createRef(),
    idPrefix,
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
    idPrefix,
  },
];

const mapState = (state: Store) => ({
  loading: state.auth.ongoingOperation !== 'idle',
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const SignUpForm: React.FC<Props & PropsFromRedux> = ({ loading }) => {
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
      ac.auth.signUp(variables as SignUpCredentials);
    }
  };

  useDefaultValues(inputs);
  const keyboardEventsProps = useModalKeyboardEvents({
    focusableElementsSelector: ['a', 'input[type="submit"]'],
    dismiss: () => undefined,
    confirm: signUp,
  });
  return (
    <div
      {...keyboardEventsProps}
      className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}
    >
      <LinearProgress loading={loading} />
      <form className={modLogin.login__form} ref={formRef}>
        {inputs.map(inputProps => (
          <ValidatedTextInput {...inputProps} key={inputProps.variableName} />
        ))}

        <input
          type={'submit'}
          value={'Sign up'}
          className={`${modLogin.login__form__inputSubmit} ${modLogin.login__form__input__input} `}
          onClick={signUp}
          disabled={loading}
          style={{ marginTop: 5 }}
        />
        <ReturnToLoginPage />
      </form>
    </div>
  );
};

const _ = connector(SignUpForm);
export { _ as SignUpForm };
