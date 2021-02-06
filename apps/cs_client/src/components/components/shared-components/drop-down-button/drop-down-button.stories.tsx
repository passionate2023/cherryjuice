import * as React from 'react';
import { DropDownButton, ButtonSquare } from '@cherryjuice/components';
import { Grid } from '@cherryjuice/components/storybook/board';

const config = {
  title: 'buttons',
};
export const DropDown = () => {
  return (
    <Grid>
      <div
        style={{
          minHeight: 40,

          // children
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          backgroundColor: 'var(--background)',
          userSelect: 'none',
        }}
      >
        {
          <DropDownButton
            buttons={['+', '-', '*', '/'].map(text => ({
              key: text,
              element: <ButtonSquare text={text} key={text} />,
            }))}
            md={false}
          />
        }
      </div>
    </Grid>
  );
};

export default config;
