import * as React from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { modLogin } from '::sass-modules';
import { useModalKeyboardEvents } from '@cherryjuice/shared-helpers';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { apolloClient } from '::graphql/client/apollo-client';
import { useStatefulValidatedInput } from '::root/components/auth/hooks/stateful-validated-input';
import { RESET_PASSWORD } from '::graphql/mutations/user/reset-password';
import { router } from '::root/router/router';
import { VERIFY_TOKEN } from '::graphql/mutations/user/verify-token';
import { ReturnToLoginPage } from '::root/components/auth/components/signup-form';
import { ac } from '::store/store';
import { useMutation } from '::hooks/graphql/use-mutation';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';

const idPrefix = 'reset--password';
const inputs: ValidatedTextInputProps[] = [
  {
    inputRef: createRef(),
    variableName: 'newPassword',
    patterns: [patterns.password],
    label: 'new password',
    type: 'password',
    minLength: 8,
    required: true,
    idPrefix,
  },
  {
    inputRef: createRef(),
    variableName: 'newPasswordConfirmation',
    patterns: [patterns.password],
    label: 'confirm new password',
    type: 'password',
    minLength: 8,
    required: true,
    idPrefix,
  },
];

export const getToken = () => {
  const token = /#([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/.exec(
    location.hash,
  );
  if (token) location.hash = '';
  return token ? token[1] : '';
};

const useVerifyToken = (setError, token: string) => {
  const [valid, setValid] = useState<boolean>();
  useEffect(() => {
    if (token) {
      apolloClient
        .mutate(VERIFY_TOKEN({ token }))
        .then(() => {
          setValid(true);
        })
        .catch(error => {
          setValid(false);
          setError({ ...error, persistent: true });
        });
    } else {
      router.goto.signIn();
    }
  }, []);
  return valid;
};

const mapState = (state: Store) => ({
  token: state.auth.resetPasswordToken,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const ResetPassword: React.FC<Props & PropsFromRedux> = ({ token }) => {
  const password = useStatefulValidatedInput(inputs[0]);
  const passwordConfirmation = useStatefulValidatedInput(inputs[1]);
  const formRef = useRef<HTMLFormElement>();
  const valid = useVerifyToken(ac.auth.setAuthenticationFailed, token);
  const validPassword =
    valid && password.valid && password.value === passwordConfirmation.value;
  const [resetPassword, resetPasswordState] = useMutation({
    gqlPipe: RESET_PASSWORD,
    variables: {
      input: {
        newPassword: password.value,
        token: token,
      },
    },
    onSuccess: () => {
      router.goto.signIn();
      ac.auth.clearResetPasswordToken();
    },
    onFailure: ac.auth.setAuthenticationFailed,
  });
  const submit = (e?: any) => {
    if (formRef.current.checkValidity()) {
      if (e) e.preventDefault();
      if (validPassword) {
        resetPassword();
      }
    }
  };
  const keyboardEventsProps = useModalKeyboardEvents({
    focusableElementsSelector: ['a', 'input[type="submit"]'],
    dismiss: () => undefined,
    confirm: submit,
  });
  return (
    <div
      {...keyboardEventsProps}
      className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}
    >
      <LinearProgress loading={resetPasswordState === 'in-progress'} />
      <form className={modLogin.login__form} ref={formRef}>
        <span className={modLogin.login__form__createAccount}>
          Enter your new password
        </span>
        {inputs.map(inputProps => (
          <ValidatedTextInput
            {...inputProps}
            key={inputProps.label}
            disabled={valid === false}
          />
        ))}
        {
          <input
            type={'submit'}
            value={'Reset password'}
            className={`${modLogin.login__form__inputSubmit} ${modLogin.login__form__input__input} `}
            onClick={submit}
            disabled={!validPassword}
            style={{ marginTop: 5 }}
          />
        }
        <ReturnToLoginPage text={'return to'} linkText={'login page'} />
      </form>
    </div>
  );
};

const _ = connector(ResetPassword);
export { _ as ResetPassword };
