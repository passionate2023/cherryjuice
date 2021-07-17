import * as React from 'react';
import { Home } from '::app/components/home/home';
// eslint-disable-next-line node/no-extraneous-import

const config = {
  title: 'home',
};

export const full = () => {
  return <Home />;
};

full.parameters = {
  design: {
    type: 'figma',
    url:
      localStorage['figmaFile'] +
      JSON.parse(localStorage['figmaNodeIds'] || '{}')['layouts/home'],
  },
};
export default config;
