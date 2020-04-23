import * as React from 'react';
import { modLogin } from '::sass-modules/index';
import { Checkbox } from '::shared-components/checkbox';
import { GoogleOauthButton } from '::shared-components/buttons/google-oauth-button';
import { Icon, Icons } from '::shared-components/icon';

type Props = { text: string };
const Separator = ({ text }) => (
  <div className={modLogin.login__separator}>
    <div className={modLogin.login__separator__line} />
    <span className={modLogin.login__separator__text}>{text}</span>
    <div className={modLogin.login__separator__line} />
  </div>
);
const Login: React.FC<Props> = ({}) => {
  return (
    <div className={modLogin.login__card}>
      <form className={modLogin.login__form}>
        <GoogleOauthButton />
        <Separator text={'or'} />
        {[
          { label: 'username', icon: Icons.misc.person },
          { label: 'password', type: 'password', icon: Icons.misc.lock },
        ].map(({ label, type = 'text', icon }) => (
          <span className={modLogin.login__form__input}>
            <Icon name={icon} className={modLogin.login__form__input__icon} />
            <input
              type={type}
              placeholder={label}
              className={modLogin.login__form__input__input}
            />
          </span>
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

        <a className={modLogin.login__form__createAccount} href={'/signup'}>
        or <a href="/signup" className={modLogin.login__form__createAccount__icon} >create an account</a>
        </a>
      </form>
    </div>
  );
};

export { Login };
