import * as React from 'react';
import { joinClassNames, useOnKeyPress } from '@cherryjuice/shared-helpers';
import mod from './square-toggle.scss';
import { Icon, IconName } from '@cherryjuice/icons';
import { useRef } from 'react';
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
  const ref = useRef();
  useOnKeyPress({ ref, onClick, keys: ['Space', 'Enter'] });
  return (
    <div
      className={joinClassNames([
        mod.squareToggle,
        enabled && mod.squareToggleEnabled,
      ])}
      onClick={onClick}
      data-testid={testId}
      tabIndex={0}
      ref={ref}
      data-focusable="self"
    >
      <Icon name={icon} size={iconSize} />
    </div>
  );
};
