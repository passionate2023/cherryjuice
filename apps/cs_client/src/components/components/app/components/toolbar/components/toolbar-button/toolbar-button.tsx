import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import mod from '::app/components/toolbar/components/toolbar-button/toolbar-button.scss';
import { TooltipProps } from '@cherryjuice/components';
import { Icon, IconName } from '@cherryjuice/icons';
import { Tooltip } from '@cherryjuice/components';

type Props = {
  onClick: () => void;
  tooltip?: TooltipProps;
  icon?: IconName;
  iconIsImage?: boolean;
  active?: boolean;
  testId?: string;
  disabled?: boolean;
};
export const ToolbarButton: React.FC<Props> = ({
  onClick,
  tooltip,
  icon,
  iconIsImage,
  active,
  testId,
  disabled,
  children,
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={joinClassNames([
        mod.toolbarButton,
        active && mod.toolbarButtonActive,
      ])}
      data-testid={testId}
    >
      <Tooltip {...tooltip}>
        {icon && <Icon image={iconIsImage} name={icon} size={16} />}
        {children}
      </Tooltip>
    </div>
  );
};
