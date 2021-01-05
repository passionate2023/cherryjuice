import * as React from 'react';
import { render } from 'react-dom';
import { Root } from '::root/root';
import '@cherryjuice/shared-styles/build/global/body.scss';
import { register } from '::helpers/service-worker';

render(<Root />, document.querySelector('#cs'));

if (process.env.NODE_ENV !== 'development') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap';
  document.head.appendChild(link);
}

register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});
