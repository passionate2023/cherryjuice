import * as React from 'react';
import mod from './info-bar-icon.scss';
import { Tooltip } from '@cherryjuice/components';
import { Icon, IconName } from '@cherryjuice/icons';
type Props = {
  tooltip: string;
  icon?: IconName;
  className?: string;
};
export const InfoBarIcon: React.FC<Props> = ({
  icon,
  tooltip,
  className = '',
  children,
}) => {
  return (
    <Tooltip tooltip={tooltip}>
      {bind => (
        <div {...bind} className={mod.infoBarIcon + ' ' + className}>
          {icon ? <Icon name={icon} size={20} /> : children}
        </div>
      )}
    </Tooltip>
  );
};
