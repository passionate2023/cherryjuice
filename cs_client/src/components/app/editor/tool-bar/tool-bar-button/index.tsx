import * as React from 'react';
import toolbarMod from '::sass-modules/tool-bar.scss';

const ToolbarButton: React.FC<{
  onClick?: any;
  enabled?: boolean;
  className?: string;
}> = ({ onClick, children, enabled, className }) => (
  <div
    className={`${toolbarMod.toolBar__icon} ${
      enabled ? toolbarMod.toolBar__iconEnabled : ''
    } ${className ? className : ''}`}
    {...(onClick && { onClick })}
  >
    {children && children}
  </div>
);

export { ToolbarButton };
