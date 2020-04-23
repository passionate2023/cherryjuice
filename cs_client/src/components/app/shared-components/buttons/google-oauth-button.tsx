import * as React from 'react';
import modGoogleOauth from '::sass-modules/shared-components/google-oauth-button.scss';
import { Icon, Icons } from '::shared-components/icon';
type Props = { signIn?: boolean };

const GoogleOauthButton: React.FC<Props> = ({ signIn = true }) => {
  return (
    <div className={modGoogleOauth.googleBtn}>
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
