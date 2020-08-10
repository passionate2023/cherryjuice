import * as React from 'react';
import { modAuthScreen } from '::sass-modules';
import { Banner } from '::auth/banner';
import { Route, Switch } from 'react-router';
import { LoginForm } from '::app/auth/components/login-form';
import { SignUpForm } from '::app/auth/components/signup-form';
import { OauthSignUpForm } from '::app/auth/components/oauth-signup-form';
import { ResetPassword } from '::app/auth/components/reset-password';
import { ForgotPassword } from '::app/auth/components/forgot-password';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const mapState = (state: Store) => ({
  error: state.auth.alert,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const AuthScreen: React.FC<Props & PropsFromRedux> = ({ error }) => {
  return (
    <div className={modAuthScreen.authScreen}>
      <div className={modAuthScreen.authScreen__cardContainer}>
        <Banner error={error} />
        <Switch>
          <Route path={'/auth/login'} component={LoginForm} />
          <Route path={'/auth/signup'} component={SignUpForm} />
          <Route path={'/auth/signup-oauth'} component={OauthSignUpForm} />
          <Route path={'/auth/reset-password'} component={ResetPassword} />
          <Route path={'/auth/forgot-password'} component={ForgotPassword} />
        </Switch>
      </div>
    </div>
  );
};

const _ = connector(AuthScreen);
export { _ as AuthScreen };
