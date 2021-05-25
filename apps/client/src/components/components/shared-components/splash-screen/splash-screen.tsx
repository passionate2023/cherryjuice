import * as React from 'react';
import mod from './splash-screen.scss';
import { Icon } from '@cherryjuice/icons';
type Props = {};
export const SplashScreen: React.FC<Props> = () => {
  return (
    <div className={mod.splashScreen}>
      <Icon
        name={'cherry-juice'}
        className={mod.splashScreen__logo}
        size={80}
      />
    </div>
  );
};
