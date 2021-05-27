import * as React from 'react';
import mod from './section-header.scss';
import { Icon, IconName } from '@cherryjuice/icons';

export type SectionHeaderProps = {
  text: string;
  action?: {
    icon: IconName;
    onClick: () => void;
  };
};
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  text,
  action,
}) => {
  return (
    <div className={mod.sectionHeader}>
      <span>{text}</span>
      {action && <Icon name={action.icon} onClick={action.onClick} />}
    </div>
  );
};

export { mod as modSectionHeader };
