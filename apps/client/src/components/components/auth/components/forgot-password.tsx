import * as React from 'react';
import { createRef, useRef, useState } from 'react';
import { modLogin } from '::sass-modules';
import { Icons } from '@cherryjuice/icons';
import { useModalKeyboardEvents } from '@cherryjuice/shared-helpers';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '@cherryjuice/components';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { apolloClient } from '::graphql/client/apollo-client';
import { CREATE_PASSWORD_RESET_TOKEN } from '::graphql/mutations/user/create-password-reset-token';
import { useStatefulValidatedInput } from '::root/components/auth/hooks/stateful-validated-input';
import { ReturnToLoginPage } from '::root/components/auth/components/signup-form';
import { ac } from '::store/store';
import { SubmitButton } from '::auth/components/shared-components/submit-buttton/submit-button';
import { authFormFocusableElements } from '::auth/components/login-form/login-form';
import { properErrorMessage } from '::auth/hooks/proper-error-message';
import { AlertType } from '::types/react';

const idPrefix = 'forgot-password';
const inputs: ValidatedTextInputProps[] = [
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
    label: 'username',
    icon: [Icons.material.username],
    patterns: [patterns.userName, patterns.email],
    minLength: 4,
    required: true,
    variableName: 'emailOrUsername',
    inputRef: createRef(),
    idPrefix: 'login',
  },
];

const ForgotPassword: React.FC = () => {
  const [timestamp, setTimestamp] = useState(0);
  const [loading, setLoading] = useState(false);
  const email = useStatefulValidatedInput(inputs[0]);
  const username = useStatefulValidatedInput(inputs[1]);
  const formRef = useRef<HTMLFormElement>();
  const signUp = (e?: any) => {
    if (formRef.current.checkValidity()) {
      if (e) e.preventDefault();
      if (username && email) {
        setLoading(true);
        apolloClient
          .mutate(
            CREATE_PASSWORD_RESET_TOKEN({
              email: email.value,
              username: username.value,
            }),
          )
          .then(tokenTimestamp => {
            if (tokenTimestamp) {
              ac.auth.setAlert({
                title: `a verification email was sent to ${email.value}`,
                type: AlertType.Neutral,
              });
              setTimestamp(tokenTimestamp);
            }
          })
          .catch(error => {
            ac.auth.setAlert({
              title: properErrorMessage(error),
              error,
              type: AlertType.Error,
            });
            setTimestamp(0);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
  const keyboardEventsProps = useModalKeyboardEvents({
    focusableElementsSelector: authFormFocusableElements,
    dismiss: () => undefined,
    confirm: signUp,
  });
  const disableSignupButton = !email.valid || !username.valid;
  return (
    <div
      className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}
      {...keyboardEventsProps}
    >
      <LinearProgress loading={loading} />
      <form className={modLogin.loginForm} ref={formRef}>
        <span className={modLogin.loginForm__bottomSection}>
          Enter your email and username
        </span>
        {inputs.map(inputProps => (
          <ValidatedTextInput {...inputProps} key={inputProps.label} />
        ))}

        <SubmitButton
          text={timestamp ? 'Resend email' : 'Reset password'}
          onClick={signUp}
          disabled={disableSignupButton}
        />
        <ReturnToLoginPage text={'return to'} linkText={'login page'} />
      </form>
    </div>
  );
};

export { ForgotPassword };
