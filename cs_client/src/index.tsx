
import * as React from 'react';
import { render } from 'react-dom';
import Root from '::root/root';

render(<Root />, document.querySelector('#cs'));

if (process.env.NODE_ENV !== 'development') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '//fonts.googleapis.com/css?family=Roboto:400';
  document.head.appendChild(link);
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/workbox-sw.js').then(registration => {
    if(process.env.NODE_ENV==='developmenet')
      // eslint-disable-next-line no-console
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
    if(process.env.NODE_ENV==='developmenet')
      // eslint-disable-next-line no-console
      console.log('SW registration failed: ', registrationError);
    });
  });
}