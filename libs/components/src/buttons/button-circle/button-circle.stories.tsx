import * as React from 'react';
import { ButtonCircle } from '@cherryjuice/components';
import { Grid } from '../../storybook/board';

const config = {
  title: 'buttons',
};
export const circle = () => {
  return (
    <Grid>
      <ButtonCircle text={'+'} />
      <ButtonCircle text={'+'} disabled={true} />
      <ButtonCircle text={'+'} active={true} />
      <ButtonCircle text={'+'} variant={'danger'} />
    </Grid>
  );
};

export default config;
