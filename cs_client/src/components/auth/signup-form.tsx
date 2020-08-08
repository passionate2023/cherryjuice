/* eslint-disable no-console */
import * as React from 'react';
import { modLogin } from '::sass-modules/index';
import { Icons } from '::shared-components/icon/icon';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::shared-components/form/validated-text-input';
import { patterns } from '::auth/helpers/form-validation';
import { AuthScreen } from '::auth/auth-screen';
import { createRef, useRef } from 'react';
import { LinearProgress } from '::shared-components/linear-progress';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { SignUpCredentials } from '::types/graphql/generated';
import { useDefaultValues } from '::hooks/use-default-form-values';

export const ReturnToLoginPage: React.FC<{
  text?: string;
  linkText?: string;
}> = ({ text, linkText }) => (
  <span className={modLogin.login__form__createAccount}>
    {text || 'already a member?'}{' '}
    <Link to="/login" className={modLogin.login__form__createAccount__icon}>
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
  alert: state.auth.alert,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const SignUpForm: React.FC<Props & PropsFromRedux> = ({ loading, alert }) => {
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
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    focusableElementsSelector: ['a', 'input[type="submit"]'],
    onCloseModal: () => undefined,
    onConfirmModal: signUp,
  });
  return (
    <AuthScreen error={alert}>
      <div className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}>
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
    </AuthScreen>
  );
};

const _ = connector(SignUpForm);
export { _ as SignUpForm };
