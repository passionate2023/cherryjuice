import * as React from 'react';
import { modAuthScreen } from '::sass-modules/index';
import { Banner, BannerProps } from './banner';
import { useEffect } from 'react';
import { router } from '::root/router/router';

type Props = BannerProps & { userId };

const AuthScreen: React.FC<Props> = ({ userId, children, error }) => {
  useEffect(() => {
    if (userId) {
      router.goto.home();
    }
  }, [userId]);
  return (
    <div className={modAuthScreen.authScreen}>
      <div className={modAuthScreen.authScreen__cardContainer}>
        <Banner error={error} />
        {children}
      </div>
    </div>
  );
};

export { AuthScreen };
