import * as React from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { modLogin } from '::sass-modules';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { useStatefulValidatedInput } from '::root/components/auth/hooks/stateful-validated-input';
import { RESET_PASSWORD } from '::graphql/mutations/user/reset-password';
import { router } from '::root/router/router';
import { VERIFY_TOKEN } from '::graphql/mutations/user/verify-token';
import { ReturnToLoginPage } from '::root/components/auth/components/signup-form';
import { ac } from '::store/store';
import { useMutation } from '::hooks/graphql/use-mutation';

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
    router.get.location.hash,
  );
  location.hash = '';
  return token ? token[1] : '';
};

const useVerifyToken = setError => {
  const token = useRef<string>();
  const [valid, setValid] = useState<boolean>();
  useEffect(() => {
    token.current = getToken();
    if (token.current) {
      apolloCache.client
        .mutate(VERIFY_TOKEN({ token: token.current }))
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
  return { token: { value: token.current, valid } };
};

type Props = {};
const ResetPassword: React.FC<Props> = () => {
  const password = useStatefulValidatedInput(inputs[0]);
  const passwordConfirmation = useStatefulValidatedInput(inputs[1]);
  const formRef = useRef<HTMLFormElement>();
  const { token } = useVerifyToken(ac.auth.setAuthenticationFailed);
  const validPassword =
    token.valid &&
    password.valid &&
    password.value === passwordConfirmation.value;
  const [resetPassword, resetPasswordState] = useMutation({
    gqlPipe: RESET_PASSWORD,
    variables: {
      input: {
        newPassword: password.value,
        token: token.value,
      },
    },
    onSuccess: router.goto.signIn,
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
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    focusableElementsSelector: ['a', 'input[type="submit"]'],
    onCloseModal: () => undefined,
    onConfirmModal: submit,
  });
  return (
    <div className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}>
      <LinearProgress loading={resetPasswordState === 'in-progress'} />
      <form className={modLogin.login__form} ref={formRef}>
        <span className={modLogin.login__form__createAccount}>
          Enter your new password
        </span>
        {inputs.map(inputProps => (
          <ValidatedTextInput
            {...inputProps}
            key={inputProps.label}
            disabled={token.valid === false}
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

export { ResetPassword };
