import * as React from 'react';
import { modAuthScreen } from '::sass-modules';
import { Banner } from '::root/components/auth/components/banner';
import { Route, Switch } from 'react-router';
import { LoginForm } from '::root/components/auth/components/login-form';
import { SignUpForm } from '::root/components/auth/components/signup-form';
import { OauthSignUpForm } from '::root/components/auth/components/oauth-signup-form';
import { ResetPassword } from '::root/components/auth/components/reset-password';
import { ForgotPassword } from '::root/components/auth/components/forgot-password';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';

const mapState = (state: Store) => ({
  error: state.auth.alert,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const Auth: React.FC<Props & PropsFromRedux> = ({ error }) => {
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

const _ = connector(Auth);
export { _ as Auth };
