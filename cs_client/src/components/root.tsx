import * as React from 'react';
import { useApolloClient } from '::graphql/apollo';
import { Suspense, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { Void } from '::shared-components/suspense-fallback/void';
import { App } from '::root/app';
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
import { router } from '::root/router/router';
import { useConsumeToken } from '::root/hooks/consume-token';
import { AuthScreen } from '::app/auth/auth-screen';

const pathnameStartsWith = route =>
  router.get.location.pathname.startsWith(route);
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

  useEffect(() => {
    const unfinishedOauthSignup = userId && hasPassword === false;
    if (unfinishedOauthSignup) router.goto.oauthSignup();

    const finishedLogin =
      userId &&
      hasPassword &&
      ['/auth/login', '/auth/signup', '/auth/signup-oauth'].some(
        pathnameStartsWith,
      );
    if (finishedLogin) router.goto.home();
  }, [userId, hasPassword]);

  useConsumeToken({ userId });
  return (
    <Suspense fallback={<Void />}>
      {client && (
        <ApolloProvider client={client}>
          <Switch>
            <Route path={'/auth'} component={AuthScreen} />
            <Route path={'(/|/document/*)'} component={App} />
            <Route
              render={() => <Redirect to={userId ? '/' : 'auth/login'} />}
            />
          </Switch>
        </ApolloProvider>
      )}
    </Suspense>
  );
};

const ConnectedRoot = connector(Root);

const RootWithRedux: React.FC = props => {
  const { loadedEpics } = useLoadEpics();
  return (
    loadedEpics && (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <ConnectedRoot {...props} />
        </PersistGate>
      </Provider>
    )
  );
};
export { RootWithRedux as Root };
