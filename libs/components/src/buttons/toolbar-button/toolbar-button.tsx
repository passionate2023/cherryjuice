import * as React from 'react';
import mod from './toolbar-button.scss';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Icon } from '@cherryjuice/icons';
import { Tooltip } from '::root/unclassified';
import { TooltipProps } from '::root/unclassified/tooltip/tooltip';

const ToolbarButton: React.FC<{
  onClick?: any;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  testId?: string;
  dontMount?: boolean;
  icon?: string;
  tooltip?: TooltipProps;
}> = ({
  icon,
  dontMount,
  onClick,
  children,
  active,
  className,
  disabled,
  testId,
  tooltip,
}) =>
  !dontMount && (
    <div
      data-disabled={disabled}
      className={joinClassNames([
        mod.toolbarButton,
        [mod.toolBar__iconActive, active],
        className,
      ])}
      onClick={!disabled ? onClick : undefined}
      data-testid={testId}
    >
      <Tooltip {...tooltip}>
        {icon && <Icon name={icon} />}
        {children}
      </Tooltip>
    </div>
  );

export { ToolbarButton };
