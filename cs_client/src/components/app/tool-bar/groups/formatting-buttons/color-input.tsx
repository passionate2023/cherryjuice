import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import modToolbar from '::sass-modules/tool-bar.scss';
import { execK } from '::helpers/execK';

const ColorInput: React.FC<{ label: string; cssProperty: string }> = ({
  label,
  cssProperty
}) => {
  return (
    <ToolbarButton>
      <label htmlFor={label} style={{ cursor: 'pointer' }}>
        <span className={modToolbar.toolBar__letterIcon}>{label}</span>
        <input
          id={label}
          type="color"
          style={{ display: 'none' }}
          onChange={e => {
            execK({ style: `${cssProperty}:${e.target.value}` });
          }}
        />
      </label>
    </ToolbarButton>
  );
};

export { ColorInput };
