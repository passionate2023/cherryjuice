import * as React from 'react';
import { Icon, Icons,  } from '::shared-components/icon';
import { modGoogleOauth } from '::sass-modules/index';
import { useOnKeyPress } from '::hooks/use-on-key-up';
import { EventHandler } from 'react';

type Props = { signIn?: boolean; onClick: EventHandler<any> };
const GoogleOauthButton: React.FC<Props> = ({ onClick, signIn = true }) => {
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
          svg={{
            name: Icons.misc['google-g'],
          }}
          containerAttributes={{
            className: modGoogleOauth.googleIconSvg,
          }}
        />
      </div>
      <p className={modGoogleOauth.btnText}>
        <b> {signIn ? 'Login' : 'Sign up'} with Google</b>
      </p>
    </div>
  );
};

export { GoogleOauthButton };
