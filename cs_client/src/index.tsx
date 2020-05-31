import '::assets/styles/global-scope/material-ui.scss';
import '::assets/styles/base.scss';
import '::assets/styles/global-scope/global-classes.scss';
import '::assets/styles/global-scope/google-picker.scss';
import '::assets/styles/css-variables/css-variables.scss';
import * as React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Root } from '::root/root';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { navigate } from '::root/router/navigate';

render(
  <Router history={navigate.__history}>
    <Root />
  </Router>,
  document.querySelector('#app'),
);
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.__APOLLO_CACHE__ = apolloCache;
}
