import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from '::app/index';
render(
  <Router>
    <App />
  </Router>,
  document.querySelector('#app'),
);
