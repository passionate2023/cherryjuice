/* eslint-disable no-console */
import * as React from 'react';
import {  modLogin } from '::sass-modules/index';
import { Checkbox } from '::shared-components/checkbox';
import { GoogleOauthButton } from '::shared-components/buttons/google-oauth-button';
import {  Icons } from '::shared-components/icon';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { TextInput, TextInputProps } from '::shared-components/form/text-input';
import { FormSeparator } from '::shared-components/form/form-separator';
import { patterns } from '::app/auth/helpers/form-validation';

type Props = { text: string };



const inputs: TextInputProps[] = [
  {
    label: 'username',
    icon: Icons.misc.person,
    patterns: [patterns.notEmpty, patterns.userName, patterns.email],
    minLength: 4,
    required: true,
  },
  {
    label: 'password',
    type: 'password',
    icon: Icons.misc.lock,
    minLength: 8,
    required: true,
  },
];

const LoginForm: React.FC<Props> = ({}) => {
  useModalKeyboardEvents({
    modalSelector: '.' + modLogin.login__card,
    onCloseModal: () => undefined,
    focusableElementsSelector: ['a', 'input[type="submit"]', '#google-btn'],
  });
  return (
    <div className={modLogin.login__card}>
      <form className={modLogin.login__form}>
        <GoogleOauthButton
          onClick={() => console.log('redirecting to google')}
        />
        <FormSeparator text={'or'} />
        {inputs.map(inputProps => (
          <TextInput {...inputProps} />
        ))}
        <span className={modLogin.login__form__rememberMe}>
          <Checkbox className={modLogin.login__form__rememberMe__checkbox} />{' '}
          <span className={modLogin.login__form__rememberMe__text}>
            Remember me
          </span>
        </span>
        <input
          type={'submit'}
          value={'Login'}
          className={`${modLogin.login__form__input__input} ${modLogin.login__form__inputSubmit}`}
        />

        <span className={modLogin.login__form__createAccount}>
          or{' '}
          <a
            href="/signup"
            className={modLogin.login__form__createAccount__icon}
          >
            create an account
          </a>
        </span>
      </form>
    </div>
  );
};

export { LoginForm };
