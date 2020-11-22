import * as React from 'react';
import { modLogin } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';
import { useModalKeyboardEvents } from '::hooks/modals/close-modal/use-modal-keyboard-events';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { createRef, useRef, useState } from 'react';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { apolloClient } from '::graphql/client/apollo-client';
import { CREATE_PASSWORD_RESET_TOKEN } from '::graphql/mutations/user/create-password-reset-token';
import { useStatefulValidatedInput } from '::root/components/auth/hooks/stateful-validated-input';
import { ReturnToLoginPage } from '::root/components/auth/components/signup-form';
import { ac } from '::store/store';

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

type Props = {};
const ForgotPassword: React.FC<Props> = () => {
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
              ac.auth.setAuthenticationFailed({
                localMessage: `a verification email was sent to ${email.value}`,
              });
              setTimestamp(tokenTimestamp);
            }
          })
          .catch(error => {
            ac.auth.setAuthenticationFailed(error);
            setTimestamp(0);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
  const keyboardEventsProps = useModalKeyboardEvents({
    focusableElementsSelector: ['a', 'input[type="submit"]'],
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
      <form className={modLogin.login__form} ref={formRef}>
        <span className={modLogin.login__form__createAccount}>
          Enter your email and username
        </span>
        {inputs.map(inputProps => (
          <ValidatedTextInput {...inputProps} key={inputProps.label} />
        ))}

        <input
          type={'submit'}
          value={timestamp ? 'Resend email' : 'Reset password'}
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

export { ForgotPassword };
