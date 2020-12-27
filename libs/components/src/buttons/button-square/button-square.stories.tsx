import * as React from 'react';
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

export default config;
