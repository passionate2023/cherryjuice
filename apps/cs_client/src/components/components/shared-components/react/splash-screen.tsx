import * as React from 'react';
import { modSplashScreen } from '::sass-modules';
type Props = {};

const SplashScreen: React.FC<Props> = () => {
  return (
    <div className={modSplashScreen.splashScreen}>
      <img
        src={'/icons/material/cherry-juice.svg'}
        alt="cherry-juice logo"
        className={modSplashScreen.splashScreen__logo}
      />
    </div>
  );
};

export { SplashScreen };
