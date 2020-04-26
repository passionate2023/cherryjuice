import * as React from 'react';
import {  client } from '::graphql/apollo';
import { LoginForm } from '::auth/login-form';
import { useState, Suspense, useEffect } from 'react';
import { Route, useHistory } from 'react-router';
import { Void } from '::shared-components/suspense-fallback/void';
import { App } from '::root/app';
import { SignUpForm } from '::auth/signup-form';
import { RootContext } from './root-context';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { getSavedSession, saveSession } from '::auth/helpers/auth-state';
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
      localStorage.removeItem('cs.user.token');
      localStorage.removeItem('cs.user.user');
      if (!isOnLoginOrSignUp) history.push('/login');
    } else {
      if (isOnLoginOrSignUp) {
        history.push('/');
      }

      saveSession(session);
    }
  }, [session]);
};

const Root: React.FC<Props> = () => {
  useOnWindowResize([cssVariables.setVH, cssVariables.setVW]);
  const [session, setSession] = useState(getSavedSession);

  useProtectedRoutes({ session });
  return (
    <RootContext.Provider value={{ session, setSession }}>
      <Suspense fallback={<Void />}>
        <ApolloProvider client={client}>
          {session.token && (
            <Route
              path={'/'}
              render={() => <App session={session} setSession={setSession} />}
            />
          )}
          <Route
            path={'/login'}
            render={() => (
              <LoginForm setSession={setSession} session={session} />
            )}
          />{' '}
          <Route
            path={'/signup'}
            render={() => (
              <SignUpForm setSession={setSession} session={session} />
            )}
          />
        </ApolloProvider>
      </Suspense>
    </RootContext.Provider>
  );
};

export { Root };
