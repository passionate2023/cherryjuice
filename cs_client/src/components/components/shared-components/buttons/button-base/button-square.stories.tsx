import React from 'react';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { Grid } from '::root/components/shared-components/storybook/board';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';

const config = {
  title: 'shared/button',
};
export const square = () => {
  return (
    <Grid>
      <ButtonSquare text={'add'} />
      <ButtonSquare text={'add'} disabled={true} />
      <ButtonSquare text={'add'} active={true} />
      <ButtonSquare text={'add'} variant={'danger'} />
      <ButtonCircle text={'+'} />
      <ButtonCircle text={'+'} disabled={true} />
      <ButtonCircle text={'+'} active={true} />
      <ButtonCircle text={'+'} variant={'danger'} />
    </Grid>
  );
};

export default config;
