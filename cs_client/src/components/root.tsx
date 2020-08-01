import * as React from 'react';
import { useApolloClient } from '::graphql/apollo';
import { LoginForm } from '::auth/login-form';
import { Suspense } from 'react';
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

const mapState = (state: Store) => ({
  token: state.auth.token,
  user: state.auth.user,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Root: React.FC<Props & PropsFromRedux> = ({ token, user }) => {
  useOnWindowResize([cssVariables.setVH, cssVariables.setVW]);
  const client = useApolloClient(token, user?.id);
  useSetupHotKeys();
  const { loadedEpics } = useLoadEpics();
  return (
    <Suspense fallback={<Void />}>
      {client && loadedEpics && (
        <ApolloProvider client={client}>
          <Switch>
            <Route path={'/login'} render={() => <LoginForm />} />{' '}
            <Route path={'/signup'} render={() => <SignUpForm />} />
            <Route path={'/*'} render={() => <App />} />
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
