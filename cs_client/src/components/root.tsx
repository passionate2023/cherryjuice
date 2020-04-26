import * as React from 'react';
import { client } from '::graphql/apollo';
import { LoginForm } from '::auth/login-form';
import { useState, Suspense, useEffect } from 'react';
import { Route, useHistory } from 'react-router';
import { Void } from '::shared-components/suspense-fallback/void';
import { App } from '::app/index';
import { AuthUser } from '::types/graphql/generated';
import { SignUpForm } from '::auth/signup-form';
import { RootContext } from './root-context';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
const ApolloProvider = React.lazy(() =>
  import('@apollo/react-common').then(({ ApolloProvider }) => ({
    default: ApolloProvider,
  })),
);
type Props = {};

const getSavedSession = (): AuthUser => {
  const token = localStorage.getItem('cs.user.token') || '';
  const user = localStorage.getItem('cs.user.user');
  const session = { token, user: user ? JSON.parse(user) : {} };
  if (!token || !user) {
    delete session.user;
    delete session.token;
  }
  return session;
};
const setSavedSession = ({ token, user }: AuthUser) => {
  localStorage.setItem('cs.user.token', token);
  localStorage.setItem('cs.user.user', JSON.stringify(user));
};

const Root: React.FC<Props> = () => {
  useOnWindowResize([cssVariables.setVH, cssVariables.setVW]);
  const [session, setSession] = useState(getSavedSession);
  const history = useHistory();
  useEffect(() => {
    const isOnLoginOrSignUp = /(^\/login|^\/signup)/.test(
      history.location.pathname,
    );
    if (!session.token) {
      if (!isOnLoginOrSignUp) history.push('/login');
    } else {
      if (isOnLoginOrSignUp) history.push('/');
      setSavedSession(session);
    }
  }, [session]);
  return (
    <RootContext.Provider value={{ session, setSession }}>
      <Suspense fallback={<Void />}>
        <ApolloProvider client={client}>
          {session.token && (
            <Route path={'/'} render={() => <App session={session} />} />
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
