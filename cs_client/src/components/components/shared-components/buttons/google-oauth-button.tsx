import * as React from 'react';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { modGoogleOauth } from '::sass-modules';
import { useOnKeyPress } from '::hooks/use-on-key-up';
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
        <Icon
          name={Icons.misc['google-g']}
          className={modGoogleOauth.googleIconSvg}
        />
      </div>
      <p className={modGoogleOauth.btnText}>
        <b> {signIn ? 'Login' : 'Sign up'} with Google</b>
      </p>
    </div>
  );
};

export { GoogleOauthButton };