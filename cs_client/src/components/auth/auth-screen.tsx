import * as React from 'react';
import { modAuthScreen } from '::sass-modules/index';
import { Banner, BannerProps } from './banner';

type Props = BannerProps;

const AuthScreen: React.FC<Props> = ({ children, error }) => {
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
