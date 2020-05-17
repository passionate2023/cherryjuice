import * as React from 'react';
import toolbarMod from '::sass-modules/tool-bar.scss';

const ToolbarButton: React.FC<{
  onClick?: any;
  enabled?: boolean;
  className?: string;
  disabled?: boolean;
  testId?: string;
}> = ({ onClick, children, enabled, className, disabled, testId }) => (
  <div
    className={`${toolbarMod.toolBar__icon} ${
      enabled ? toolbarMod.toolBar__iconEnabled : ''
    } ${className ? className : ''}`}
    {...(!disabled && onClick && { onClick })}
    {...(testId && { 'data-testid': testId })}
  >
    {children && children}
  </div>
);

export { ToolbarButton };
