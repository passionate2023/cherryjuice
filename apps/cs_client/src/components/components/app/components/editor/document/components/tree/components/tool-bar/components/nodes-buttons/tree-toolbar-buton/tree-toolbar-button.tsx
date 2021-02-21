import * as React from 'react';
import { ButtonSquare, Tooltip } from '@cherryjuice/components';
import mod from './tree-toolbar-button.scss';
import { IconName } from '@cherryjuice/icons';

type Props = {
  onClick: () => void;
  testId?: string;
  tooltip?: string;
  disabled?: boolean;
  icon: IconName;
};

export const TreeToolbarButton: React.FC<Props> = ({
  onClick,
  testId,
  disabled,
  icon,
  tooltip,
}) => {
  return (
    <Tooltip tooltip={tooltip}>
      {bind => {
        return (
          <ButtonSquare
            onClick={onClick}
            testId={testId}
            disabled={disabled}
            className={mod.treeToolbarButton}
            iconName={icon}
            iconSize={16}
            {...bind}
          />
        );
      }}
    </Tooltip>
  );
};
