import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import { execK } from '::helpers/execK';
import { TDispatchAppReducer } from '::types/react';
import { Icon } from '../../../../shared-components/icon';

const ColorInput: React.FC<{
  label: string;
  cssProperty: string;
  inputId: string;
  dispatch: TDispatchAppReducer;
  icon: string;
}> = ({ icon, label, cssProperty, inputId, dispatch }) => {
  return (
    <ToolbarButton>
      <label htmlFor={label} style={{ cursor: 'pointer' }} id={inputId}>
        {/*<span className={modToolbar.toolBar__letterIcon}>{label}</span>*/}
        <Icon name={icon} small={true} />
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
