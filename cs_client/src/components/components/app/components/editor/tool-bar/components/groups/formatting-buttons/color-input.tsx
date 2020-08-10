import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { execK } from '::helpers/editing/execK';
import { Icon } from '::root/components/shared-components/icon/icon';
import { modToolbar } from '::sass-modules';

const ColorInput: React.FC<{
  label: string;
  cssProperty: string;
  inputId: string;
  icon: string;
  disabled?: boolean;
}> = ({ icon, label, cssProperty, inputId, disabled }) => {
  return (
    <ToolbarButton
      className={modToolbar.toolBar__iconStrictWidth}
      disabled={disabled}
    >
      <label
        htmlFor={label}
        style={!disabled ? { cursor: 'pointer' } : {}}
        id={inputId}
      >
        <Icon name={icon} />
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
