import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-common';
import { App } from '::app/index';
import { client } from './graphql/apollo';
import {
  hotKeysManager,
  setupDevHotKeys,
  setupFormattingHotKeys,
} from '::helpers/hotkeys';
render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.querySelector('#app'),
);
setupFormattingHotKeys();
setupDevHotKeys();
hotKeysManager.startListening();
