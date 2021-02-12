import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import mod from '::app/components/toolbar/components/toolbar-button/toolbar-button.scss';
import { Tooltip } from '@cherryjuice/components';
import { Icon, IconName } from '@cherryjuice/icons';

type Props = {
  onClick: () => void;
  tooltip?: string;
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
    <Tooltip tooltip={tooltip}>
      {bind => (
        <div
          onClick={disabled ? undefined : onClick}
          className={joinClassNames([
            mod.toolbarButton,
            active && mod.toolbarButtonActive,
          ])}
          data-testid={testId}
          {...bind}
        >
          {icon && <Icon image={iconIsImage} name={icon} size={16} />}
          {children}
        </div>
      )}
    </Tooltip>
  );
};
