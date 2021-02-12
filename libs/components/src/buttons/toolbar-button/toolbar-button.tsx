import * as React from 'react';
import mod from './toolbar-button.scss';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Icon } from '@cherryjuice/icons';
import { Tooltip } from '::root/popups/tooltip/tooltip';
import { IconName } from '@cherryjuice/icons';

const ToolbarButton: React.FC<{
  onClick?: any;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  testId?: string;
  dontMount?: boolean;
  icon?: IconName;
  tooltip?: string;
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
}) => {
  return (
    <Tooltip tooltip={tooltip}>
      {bind =>
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
            {...bind}
          >
            {icon && <Icon name={icon} />}
            {children}
          </div>
        )
      }
    </Tooltip>
  );
};

export { ToolbarButton };
