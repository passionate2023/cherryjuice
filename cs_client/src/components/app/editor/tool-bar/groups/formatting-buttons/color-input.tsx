import * as React from 'react';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { execK } from '::helpers/editing/execK';
import { Icon } from '::shared-components/icon/icon';
import { modToolbar } from '::sass-modules/index';

const ColorInput: React.FC<{
  label: string;
  cssProperty: string;
  inputId: string;
  icon: string;
}> = ({ icon, label, cssProperty, inputId }) => {
  return (
    <ToolbarButton className={modToolbar.toolBar__iconStrictWidth}>
      <label htmlFor={label} style={{ cursor: 'pointer' }} id={inputId}>
        <Icon svg={{ name: icon }} />
        <input
          id={label}
          type="color"
          style={{ display: 'none' }}
          onChange={e => {
            execK({
              style: { property: `${cssProperty}`, value: `${e.target.value}` },
            });
          }}
        />
      </label>
    </ToolbarButton>
  );
};

export { ColorInput };
