import { Grid } from '::shared-components/storybook/board';
import React from 'react';
import { ToolbarButton } from '::app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { modToolbar } from '::sass-modules';
import { DropDownButton } from '::shared-components/buttons/drop-down-button/drop-down-button';

const Icon = ({ text }) => (
  <span style={{ display: 'flex', color: 'black' }}>{text}</span>
);

const config = {
  title: 'shared/drop-down-button',
};
export const square = () => {
  return (
    <Grid>
      <div className={modToolbar.toolBar}>
        {
          <DropDownButton
            buttons={['+', '-', '*', '/'].map(text => (
              <ToolbarButton key={text}>
                <Icon text={text} />
              </ToolbarButton>
            ))}
          />
        }
      </div>
    </Grid>
  );
};

export default config;
