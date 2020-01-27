import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-common';
import { App } from './components/app/';
import { client } from './graphql/apollo';
render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.querySelector('#app')
);
