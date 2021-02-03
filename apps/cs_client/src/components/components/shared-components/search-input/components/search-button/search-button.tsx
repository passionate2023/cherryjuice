import * as React from 'react';
import mod from './search-button.scss';
import { ButtonSquare, Tooltip } from '@cherryjuice/components';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Icon, IconName } from '@cherryjuice/icons';

type PerformSearchProps = {
  className?: string;
  tooltip?: string;
  disabled?: boolean;
  onClick: () => void;
  icon: IconName;
};

export const SearchButton: React.FC<PerformSearchProps> = ({
  className,
  tooltip,
  onClick,
  disabled,
  icon,
}) => {
  return (
    <Tooltip label={tooltip}>
      <ButtonSquare
        className={joinClassNames([mod.searchButton, className])}
        disabled={disabled}
        onClick={onClick}
        icon={<Icon name={icon} />}
      />
    </Tooltip>
  );
};
