import * as React from 'react';
// eslint-disable-next-line node/no-extraneous-import
import { ButtonSquare } from '@cherryjuice/components';
import { Grid } from '../../storybook/board';

const config = {
  title: 'buttons',
};
export const square = () => {
  return (
    <Grid>
      <ButtonSquare text={'add'} />
      <ButtonSquare text={'add'} disabled={true} />
      <ButtonSquare text={'add'} active={true} />
      <ButtonSquare text={'add'} variant={'danger'} />
    </Grid>
  );
};
square.parameters = {
  design: {
    type: 'figma',
    url:
      localStorage['figmaFile'] +
      JSON.parse(localStorage['figmaNodeIds'] || '{}')['components'],
  },
};
export default config;
