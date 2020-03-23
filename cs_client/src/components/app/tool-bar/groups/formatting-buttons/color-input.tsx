import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import modToolbar from '::sass-modules/tool-bar.scss';
import { execK } from '::helpers/execK';
import { TDispatchAppReducer } from '::types/react';

const ColorInput: React.FC<{
  label: string;
  cssProperty: string;
  inputId: string;
  dispatch: TDispatchAppReducer;
}> = ({ label, cssProperty, inputId, dispatch }) => {
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
              style: { property: `${cssProperty}`, value: `${e.target.value}` },
              dispatch,
            });
          }}
        />
      </label>
    </ToolbarButton>
  );
};

export { ColorInput };
