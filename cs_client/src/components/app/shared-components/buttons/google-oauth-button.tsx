import * as React from 'react';
import { Icon, Icons } from '::shared-components/icon';
import { modGoogleOauth } from '::sass-modules/index';
import { EventHandler, useEffect } from 'react';
import { useOnKeyPress } from '::hooks/use-on-key-up';
type Props = { signIn?: boolean; onClick: EventHandler<any> };

const GoogleOauthButton: React.FC<Props> = ({ signIn = true, onClick }) => {
  useOnKeyPress({
    elementSelector: '.' + modGoogleOauth.googleBtn,
    onClick,
  });
  return (
    <div
      className={modGoogleOauth.googleBtn}
      id={'google-btn'}
      tabIndex={0}
      onClick={onClick}
    >
      <div className={modGoogleOauth.googleIconWrapper}>
        <Icon
          className={modGoogleOauth.googleIconSvg}
          name={Icons.misc['google-g']}
        />
      </div>
      <p className={modGoogleOauth.btnText}>
        <b> {signIn ? 'Login' : 'Sign up'} with Google</b>
      </p>
    </div>
  );
};

export { GoogleOauthButton };
