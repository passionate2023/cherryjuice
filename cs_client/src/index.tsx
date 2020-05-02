import '::assets/styles/global-scope/material-ui.scss';
import '::assets/styles/base.scss';
import '::assets/styles/global-scope/global-classes.scss';
import '::assets/styles/global-scope/google-picker.scss';
import '::assets/styles/css-variables/css-variables.scss';
import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Root } from '::root/root';

render(
  <Router>
    <Root />
  </Router>,
  document.querySelector('#app'),
);
