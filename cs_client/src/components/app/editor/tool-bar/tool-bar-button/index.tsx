import * as React from 'react';
import toolbarMod from '::sass-modules/tool-bar.scss';

const ToolbarButton: React.FC<{
  onClick?: any;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  testId?: string;
}> = ({ onClick, children, active, className, disabled, testId }) => (
  <div
    disabled={disabled}
    className={`${toolbarMod.toolBar__icon} ${
      active ? toolbarMod.toolBar__iconActive : ''
    } ${className ? className : ''} ${
      disabled ? toolbarMod.toolBar__iconDisabled : ''
    }`}
    {...(!disabled && onClick && { onClick })}
    {...(testId && { 'data-testid': testId })}
  >
    {children && children}
  </div>
);

export { ToolbarButton };
