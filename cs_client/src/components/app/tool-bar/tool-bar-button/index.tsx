import * as React from 'react';
import toolbarMod from '::sass-modules/tool-bar.scss';

const ToolbarButton: React.FC<{
  onClick?: any;
  enabled?: boolean;
}> = ({ onClick, children, enabled }) => (
  <div
    className={`${toolbarMod.toolBar__icon} ${
      enabled ? toolbarMod.toolBar__iconEnabled : ''
    }`}
    {...(onClick && { onClick })}
  >
    {children && children}
  </div>
);

export { ToolbarButton };
