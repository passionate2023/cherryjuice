/* eslint-disable node/no-extraneous-import */
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import '@storybook/addon-console';
import { Provider } from 'react-redux';
import { store } from '::store/store';
import modTheme from '@cherryjuice/shared-styles/build/themes/themes.scss';
import '../apps/cs_client/src/assets/styles/global-scope/material-ui.scss';
import '../apps/cs_client/src/assets/styles/global-scope/google-picker.scss';
import '@cherryjuice/shared-styles/build/global/base.scss';
import '@cherryjuice/shared-styles/build/global/css-variables.scss';
{
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap';
  document.head.appendChild(link);
}
addDecorator(story => (
  <MemoryRouter initialEntries={['/']}>
    <div className={modTheme.lightTheme}>{story()}</div>
  </MemoryRouter>
));
addDecorator(story => <Provider store={store}>{story()}</Provider>);

export const parameters = {
  backgrounds: {
    default: 'white',
    values: [
      { name: 'white', value: '#f5f5f5' },
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998' },
    ],
  },
};
