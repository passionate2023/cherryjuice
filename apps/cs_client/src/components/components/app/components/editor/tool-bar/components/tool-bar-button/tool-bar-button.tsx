import * as React from 'react';
import toolbarMod from '::sass-modules/tool-bar.scss';
import { joinClassNames } from '::helpers/dom/join-class-names';

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
      disabled={disabled}
      className={joinClassNames([
        toolbarMod.toolBar__icon,
        [toolbarMod.toolBar__iconActive, active],
        [toolbarMod.toolBar__iconDisabled, disabled],
        className,
      ])}
      {...(!disabled && { onClick })}
      {...(testId && { 'data-testid': testId })}
    >
      {children}
    </div>
  );

export { ToolbarButton };
