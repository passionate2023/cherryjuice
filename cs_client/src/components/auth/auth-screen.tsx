import * as React from 'react';
import { modAuthScreen } from '::sass-modules/index';

type Props = {};

const AuthScreen: React.FC<Props> = ({ children }) => {
  return <div className={modAuthScreen.authScreen}>{children} </div>;
};

export { AuthScreen };
