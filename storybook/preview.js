// import './storybook.scss';
import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { MemoryRouter } from 'react-router';
import '@storybook/addon-console';
import { Provider } from 'react-redux';
import { store } from '::store/store';
import modTheme from '@cherryjuice/shared-styles/build/themes/themes.scss';
import '../apps/cs_client/src/assets/styles/global-scope/material-ui.scss';
import '../apps/cs_client/src/assets/styles/global-scope/google-picker.scss';
import '@cherryjuice/shared-styles/build/global/base.scss';
import '@cherryjuice/shared-styles/build/global/css-variables.scss';
addParameters({
  backgrounds: [
    { name: 'white', value: '#f5f5f5', default: true },
    { name: 'twitter', value: '#00aced' },
    { name: 'facebook', value: '#3b5998' },
  ],
});
const eventsFromNames = actions('onClick');
addDecorator((storyFn, context) => {
  return (
    <>
      {storyFn({
        ...context,
        ...eventsFromNames,
        disabled: boolean('disabled', false),
      })}
    </>
  );
});
addDecorator(withA11y);
addDecorator(withKnobs);

addDecorator(story => (
  <MemoryRouter initialEntries={['/']}>
    <div className={modTheme.lightTheme}>{story()}</div>
  </MemoryRouter>
));
addDecorator(story => <Provider store={store}>{story()}</Provider>);
