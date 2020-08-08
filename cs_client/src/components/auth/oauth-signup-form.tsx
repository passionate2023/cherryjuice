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
import { createRef, useEffect, useRef, useState } from 'react';
import { LinearProgress } from '::shared-components/linear-progress';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { OauthSignUpCredentials } from '::types/graphql/generated';
import { router } from '::root/router/router';

const idPrefix = 'oauth-sign-up';
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
    inputRef: createRef(),
    variableName: undefined,
    patterns: [patterns.password],
    label: 'confirm password',
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
  userId: state.auth.user?.id,
  username: state.auth.user?.username,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const OauthSignUpForm: React.FC<Props & PropsFromRedux> = ({
  loading,
  alert,
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
    <AuthScreen error={alert}>
      <div className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}>
        <LinearProgress loading={loading} />
        <form className={modLogin.login__form} ref={formRef}>
          {inputs.map(inputProps => (
            <ValidatedTextInput {...inputProps} key={inputProps.label} />
          ))}

          <input
            type={'submit'}
            value={'Finish Sign up'}
            className={`${modLogin.login__form__inputSubmit} ${modLogin.login__form__input__input} `}
            onClick={signUp}
            disabled={disableSignupButton}
            style={{ marginTop: 20 }}
          />
        </form>
      </div>
    </AuthScreen>
  );
};

const _ = connector(OauthSignUpForm);
export { _ as OauthSignUpForm };