import * as React from 'react';
import { useApolloClient } from '::graphql/apollo';
import { LoginForm } from '::auth/login-form';
import { Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { Void } from '::shared-components/suspense-fallback/void';
import { App } from '::root/app';
import { SignUpForm } from '::auth/signup-form';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { store } from '::root/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useLoadEpics } from './hooks/load-epics';
import { useSetupHotKeys } from '::helpers/hotkeys/hooks/setup-hotkeys';
const ApolloProvider = React.lazy(() =>
  import('@apollo/react-common').then(({ ApolloProvider }) => ({
    default: ApolloProvider,
  })),
);
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { OauthSignUpForm } from '::auth/oauth-signup-form';
import { router } from '::root/router/router';
import { ForgotPassword } from '::auth/forgot-password';
import { ResetPassword } from '::auth/reset-password';
import { VerifyEmail } from '::auth/verify-email';

const mapState = (state: Store) => ({
  token: state.auth.token,
  userId: state.auth.user?.id,
  hasPassword: state.auth.user?.hasPassword,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Root: React.FC<Props & PropsFromRedux> = ({
  token,
  userId,
  hasPassword,
}) => {
  useOnWindowResize([cssVariables.setVH, cssVariables.setVW]);
  const client = useApolloClient(token, userId);
  useSetupHotKeys();
  const { loadedEpics } = useLoadEpics();

  useEffect(() => {
    const staticRoute = ['/verify-email'].some(route =>
      router.get.location.pathname.startsWith(route),
    );
    if (!staticRoute && userId) {
      if (hasPassword === false) {
        router.goto.oauthSignup();
      } else {
        router.goto.home();
      }
    }
  }, [userId, hasPassword]);

  return (
    <Suspense fallback={<Void />}>
      {client && loadedEpics && (
        <ApolloProvider client={client}>
          <Switch>
            <Route path={'/login'} component={LoginForm} />
            <Route path={'/signup'} component={SignUpForm} />
            <Route path={'/signup-oauth'} component={OauthSignUpForm} />
            <Route path={'/reset-password'} component={ResetPassword} />
            <Route path={'/forgot-password'} component={ForgotPassword} />
            <>
              <Route path={'/verify-email'} component={VerifyEmail} />
              <Route path={'/*'} component={App} />
            </>
          </Switch>
        </ApolloProvider>
      )}
    </Suspense>
  );
};
const ConnectedRoot = connector(Root);
const RootWithRedux: React.FC = props => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <ConnectedRoot {...props} />
      </PersistGate>
    </Provider>
  );
};
export { RootWithRedux as Root };
