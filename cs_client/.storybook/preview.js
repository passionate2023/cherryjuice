// import './storybook.scss';
import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import '@storybook/addon-console';
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
