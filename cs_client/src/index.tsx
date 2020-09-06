import '::assets/styles/global-scope/material-ui.scss';
import '::assets/styles/base.scss';
import '::assets/styles/global-scope/global-classes.scss';
import '::assets/styles/global-scope/google-picker.scss';
import '::assets/styles/css-variables/css-variables.scss';
import * as React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Root } from '::root/root';
import { router } from '::root/router/router';
import { enablePatches, setAutoFreeze } from 'immer';
import '::helpers/attach-test-callbacks';
setAutoFreeze(false);
enablePatches();
render(
  <Router history={router.get.history}>
    <Root />
  </Router>,
  document.querySelector('#cs'),
);

if (process.env.NODE_ENV !== 'development') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '//fonts.googleapis.com/css?family=Roboto:400';
  document.head.appendChild(link);
}
