import * as React from 'react';
import { Icon, Icons } from '@cherryjuice/icons';
import modGoogleOauth from './google-oauth-button.scss';
import { useOnKeyPress } from '@cherryjuice/shared-helpers';
import { EventHandler, useRef } from 'react';

type Props = { signIn?: boolean; onClick: EventHandler<any> };
const GoogleOauthButton: React.FC<Props> = ({ onClick, signIn = true }) => {
  const ref = useRef<HTMLDivElement>();
  useOnKeyPress({
    ref,
    onClick,
  });

  return (
    <div
      className={modGoogleOauth.googleBtn}
      id={'google-btn'}
      tabIndex={0}
      onClick={onClick}
      ref={ref}
    >
      <div className={modGoogleOauth.googleIconWrapper}>
        <Icon name={'google-g'} className={modGoogleOauth.googleIconSvg} />
      </div>
      <p className={modGoogleOauth.btnText}>
        <b> {signIn ? 'Login' : 'Sign up'} with Google</b>
      </p>
    </div>
  );
};

export { GoogleOauthButton };
