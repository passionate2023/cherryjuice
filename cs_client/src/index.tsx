import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { App } from '::app/index';
import { AuthScreen } from '::app/auth/auth-screen';
import { Login } from '::app/auth/login';
render(
  <Router>
    {/*<App />*/}
    <Route
      path={'/login'}
      render={() => (
        <AuthScreen>
          <Login />
        </AuthScreen>
      )}
    />
  </Router>,
  document.querySelector('#app'),
);
