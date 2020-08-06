import * as React from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { modLogin } from '::sass-modules/index';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::shared-components/form/validated-text-input';
import { AuthScreen } from '::auth/auth-screen';
import { LinearProgress } from '::shared-components/linear-progress';
import { patterns } from '::auth/helpers/form-validation';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { AsyncError } from '::auth/hooks/proper-error-message';
import { useStatefulValidatedInput } from '::auth/hooks/stateful-validated-input';
import { RESET_PASSWORD } from '::graphql/mutations/reset-password';
import { router } from '::root/router/router';
import { VERIFY_TOKEN } from '::graphql/mutations/verify-token';

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

const getToken = () => {
  const token = /token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/.exec(
    router.get.location.hash,
  );
  return token ? token[1] : '';
};

const useVerifyToken = setError => {
  const token = useRef<string>();
  const [valid, setValid] = useState<boolean>();
  useEffect(() => {
    token.current = getToken();
    if (token.current) {
      location.hash = '';
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
  const [error, setError] = useState<AsyncError>();
  const [loading, setLoading] = useState(false);
  const password = useStatefulValidatedInput(inputs[0]);
  const passwordConfirmation = useStatefulValidatedInput(inputs[1]);
  const formRef = useRef<HTMLFormElement>();
  const { token } = useVerifyToken(setError);
  const validPassword =
    token.valid &&
    password.valid &&
    password.value === passwordConfirmation.value;
  const submit = (e?: any) => {
    if (formRef.current.checkValidity()) {
      if (e) e.preventDefault();
      if (validPassword) {
        setLoading(true);
        apolloCache.client
          .mutate(
            RESET_PASSWORD({
              input: {
                newPassword: password.value,
                token: token.value,
              },
            }),
          )
          .then(() => {
            router.goto.signIn();
          })
          .catch(error => {
            setError(error);
          })
          .finally(() => {
            setLoading(false);
          });
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
    <AuthScreen error={error}>
      <div className={modLogin.login__card + ' ' + modLogin.login__cardSignUp}>
        <LinearProgress loading={loading} />
        <form className={modLogin.login__form} ref={formRef}>
          {inputs.map(inputProps => (
            <ValidatedTextInput
              {...inputProps}
              key={inputProps.label}
              disabled={token.valid === false}
            />
          ))}
          {token.valid === false ? (
            <input
              type={'submit'}
              value={'goto login'}
              className={`${modLogin.login__form__inputSubmit} ${modLogin.login__form__input__input} `}
              onClick={router.goto.signIn}
              style={{ marginTop: 20 }}
            />
          ) : (
            <input
              type={'submit'}
              value={'Reset password'}
              className={`${modLogin.login__form__inputSubmit} ${modLogin.login__form__input__input} `}
              onClick={submit}
              disabled={!validPassword}
              style={{ marginTop: 20 }}
            />
          )}
        </form>
      </div>
    </AuthScreen>
  );
};

export { ResetPassword };
