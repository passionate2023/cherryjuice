import * as React from 'react';
import { useApolloClient } from '::graphql/apollo';
import { LoginForm } from '::auth/login-form';
import { Suspense, useEffect, useReducer } from 'react';
import { Route, useHistory } from 'react-router';
import { Provider } from 'react-redux';
import { Void } from '::shared-components/suspense-fallback/void';
import { App } from '::root/app';
import { SignUpForm } from '::auth/signup-form';
import { RootContext } from './root-context';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { localSessionManager } from '::auth/helpers/auth-state';
import {
  rootActionCreators,
  rootInitialState,
  rootReducer,
} from '::root/root.reducer';
import { store } from '::root/store/index';
const ApolloProvider = React.lazy(() =>
  import('@apollo/react-common').then(({ ApolloProvider }) => ({
    default: ApolloProvider,
  })),
);
type Props = {};

const useProtectedRoutes = ({ session }) => {
  const history = useHistory();
  useEffect(() => {
    const isOnLoginOrSignUp = /(^\/login|^\/signup)/.test(
      history.location.pathname,
    );
    if (!session.token) {
      if (!isOnLoginOrSignUp) history.push('/login');
      localSessionManager.clear();
    } else {
      if (isOnLoginOrSignUp) history.push('/');
      localSessionManager.set(session);
    }
  }, [session]);
};

const Root: React.FC<Props> = () => {
  useOnWindowResize([cssVariables.setVH, cssVariables.setVW]);
  const [state, dispatch] = useReducer(rootReducer, rootInitialState);
  useEffect(() => {
    rootActionCreators.setDispatch(dispatch);
  }, []);
  useApolloClient(state.session);
  useProtectedRoutes({ session: state.session });
  return (
    <Provider store={store}>
      <RootContext.Provider value={state}>
        <Suspense fallback={<Void />}>
          {state.apolloClient && (
            <ApolloProvider client={state.apolloClient}>
              {state.session.token && (
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
    </Provider>
  );
};

export { Root };
