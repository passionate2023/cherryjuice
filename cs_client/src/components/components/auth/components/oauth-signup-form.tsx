/* eslint-disable no-console */
import * as React from 'react';
import { modLogin } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { createRef, useEffect, useRef, useState } from 'react';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { OauthSignUpCredentials } from '::types/graphql';
import { router } from '::root/router/router';
import { ReturnToLoginPage } from '::root/components/auth/components/signup-form';

const idPrefix = 'oauth::sign-up';
const inputs: ValidatedTextInputProps[] = [
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
  {
    icon: [Icons.material.lock],
    inputRef: createRef(),
    variableName: undefined,
    patterns: [patterns.password],
    label: 'confirm password',
    type: 'password',
    minLength: 8,
    required: true,
    idPrefix,
  },
];

const mapState = (state: Store) => ({
  loading: state.auth.ongoingOperation !== 'idle',
  alert: state.auth.alert,
  userId: state.auth.user?.id,
  username: state.auth.user?.username,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const OauthSignUpForm: React.FC<Props & PropsFromRedux> = ({
  loading,
  username,
}) => {
  const [passwordValid, setPasswordValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  inputs[0].defaultValue = username;
  inputs[1].value = password;
  inputs[1].onChange = setPassword;
  inputs[1].setValid = setPasswordValid;
  inputs[2].value = passwordConfirmation;
  inputs[2].onChange = setPasswordConfirmation;
  const formRef = useRef<HTMLFormElement>();
  const signUp = (e?: any) => {
    if (formRef.current.checkValidity()) {
      if (e) e.preventDefault();
      const variables = Object.fromEntries(
        inputs
          .filter(input => input.variableName)
          .map(({ variableName, inputRef }) => [
            variableName,
            // @ts-ignore
            inputRef?.current.value,
          ]),
      );
      ac.auth.signUp(variables as OauthSignUpCredentials, true);
    }
  };
  useEffect(() => {
    if (!username) router.goto.signIn();
  }, []);
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    focusableElementsSelector: ['a', 'input[type="submit"]'],
    onCloseModal: () => undefined,
    onConfirmModal: signUp,
  });
  const disableSignupButton =
    loading || !passwordValid || password !== passwordConfirmation;
  return (
    <div className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}>
      <LinearProgress loading={loading} />
      <form className={modLogin.login__form} ref={formRef}>
        <span className={modLogin.login__form__createAccount}>
          One last step
        </span>
        {inputs.map(inputProps => (
          <ValidatedTextInput {...inputProps} key={inputProps.label} />
        ))}

        <input
          type={'submit'}
          value={'Finish Sign up'}
          className={`${modLogin.login__form__inputSubmit} ${modLogin.login__form__input__input} `}
          onClick={signUp}
          disabled={disableSignupButton}
          style={{ marginTop: 5 }}
        />
        <ReturnToLoginPage text={'return to'} linkText={'login page'} />
      </form>
    </div>
  );
};

const _ = connector(OauthSignUpForm);
export { _ as OauthSignUpForm };
