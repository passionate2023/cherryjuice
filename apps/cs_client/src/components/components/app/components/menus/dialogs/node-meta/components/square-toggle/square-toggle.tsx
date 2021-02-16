import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import mod from './square-toggle.scss';
import { Icon, IconName } from '@cherryjuice/icons';
type Props = {
  enabled: boolean;
  testId?: string;
  icon: IconName;
  onClick: () => void;
  iconSize?: number;
};
export const SquareToggle: React.FC<Props> = ({
  onClick,
  enabled,
  testId,
  icon,
  iconSize,
}) => {
  return (
    <div
      className={joinClassNames([
        mod.squareToggle,
        enabled && mod.squareToggleEnabled,
      ])}
      onClick={onClick}
      data-testid={testId}
    >
      <Icon name={icon} size={iconSize} />
    </div>
  );
};
