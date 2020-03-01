import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import modToolbar from '::sass-modules/tool-bar.scss';
import { execK } from '::helpers/execK';
import { useEffect, useRef } from 'react';
import { commands } from '::app/tool-bar/groups/formatting-buttons/commands';
import { hotKeysManager, THotKey } from '::helpers/hotkeys';

const ColorInput: React.FC<{
  label: string;
  cssProperty: string;
  inputId: string;
}> = ({ label, cssProperty, inputId }) => {


  return (
    <ToolbarButton>
      <label htmlFor={label} style={{ cursor: 'pointer' }} id={inputId}>
        <span className={modToolbar.toolBar__letterIcon}>{label}</span>
        <input
          id={label}
          type="color"
          style={{ display: 'none' }}
          onChange={e => {
            execK({
              style: { property: `${cssProperty}`, value: `${e.target.value}` }
            });
          }}
        />
      </label>
    </ToolbarButton>
  );
};

export { ColorInput };
