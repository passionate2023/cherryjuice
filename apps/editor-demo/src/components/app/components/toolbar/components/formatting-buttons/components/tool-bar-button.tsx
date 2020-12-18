import * as React from 'react';
import { modToolbar } from '::sass-modules';

const ToolbarButton: React.FC<{
  onClick?: any;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  testId?: string;
  dontMount?: boolean;
}> = ({ dontMount, onClick, children, active, className, disabled, testId }) =>
  !dontMount && (
    <div
      data-disabled={disabled}
      className={`${modToolbar.toolBar__icon} ${
        active ? modToolbar.toolBar__iconActive : ''
      } ${className ? className : ''} ${
        disabled ? modToolbar.toolBar__iconDisabled : ''
      }`}
      {...(!disabled && onClick && { onClick })}
      {...(testId && { 'data-testid': testId })}
    >
      {children}
    </div>
  );

export { ToolbarButton };
