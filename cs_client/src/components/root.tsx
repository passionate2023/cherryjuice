import * as React from 'react';
import { useApolloClient } from '::graphql/apollo';
import { LoginForm } from '::auth/login-form';
import { Suspense, useEffect, useReducer } from 'react';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import { Void } from '::shared-components/suspense-fallback/void';
import { App } from '::root/app';
import { SignUpForm } from '::auth/signup-form';
import { RootContext } from './root-context';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import {
  rootActionCreators,
  rootInitialState,
  rootReducer,
} from '::root/root.reducer';
import { store } from '::root/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useLoadEpics } from './hooks/load-epics';
import { useProtectedRoutes } from './hooks/protected-routes';

const ApolloProvider = React.lazy(() =>
  import('@apollo/react-common').then(({ ApolloProvider }) => ({
    default: ApolloProvider,
  })),
);

const persistor = persistStore(store);

type Props = {};

const Root: React.FC<Props> = () => {
  useOnWindowResize([cssVariables.setVH, cssVariables.setVW]);
  const [state, dispatch] = useReducer(rootReducer, rootInitialState);
  useEffect(() => {
    rootActionCreators.setDispatch(dispatch);
  }, []);
  useApolloClient(state.session);
  useProtectedRoutes({ session: state.session });

  const { loadedEpics } = useLoadEpics();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootContext.Provider value={state}>
          <Suspense fallback={<Void />}>
            {state.apolloClient && (
              <ApolloProvider client={state.apolloClient}>
                {state.session.token && loadedEpics && (
                  <Route
                    path={'/'}
                    render={() => <App session={state.session} />}
                  />
                )}
                <Route
                  path={'/login'}
                  render={() => <LoginForm session={state.session} />}
                />{' '}
                <Route
                  path={'/signup'}
                  render={() => <SignUpForm session={state.session} />}
                />
              </ApolloProvider>
            )}
          </Suspense>
        </RootContext.Provider>
      </PersistGate>
    </Provider>
  );
};

export { Root };
