import '::assets/styles/global-scope/material-ui.scss';
import '::assets/styles/base.scss';
import '::assets/styles/global-scope/global-classes.scss';
import '::assets/styles/global-scope/google-picker.scss';
import '::assets/styles/css-variables/css-variables.scss';
import * as React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Root } from '::root/root';
import { apolloClient } from './graphql/client/apollo-client';
import { router } from '::root/router/router';
import { attachTestCallbacks } from '::helpers/attach-test-callbacks';

render(
  <Router history={router.get.__history}>
    <Root />
  </Router>,
  document.querySelector('#cs'),
);
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.__APOLLO_CACHE__ = apolloClient;
  attachTestCallbacks();
}
if (process.env.NODE_ENV !== 'development') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '//fonts.googleapis.com/css?family=Roboto:400';
  document.head.appendChild(link);
}
