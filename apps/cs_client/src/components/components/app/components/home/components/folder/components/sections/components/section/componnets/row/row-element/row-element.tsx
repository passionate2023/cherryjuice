import * as React from 'react';
import mod from './row-element.scss';
import { Icon, IconName } from '@cherryjuice/icons';
import { joinClassNames } from '@cherryjuice/shared-helpers';

export type RowElementsProps = {
  text: string;
  icon?: IconName;
  onClick: () => void;
  isHead?: boolean;
  rowIsCollapsed?: boolean;
};

export const RowElement: React.FC<RowElementsProps> = ({
  text,
  icon,
  onClick,
  isHead,
  rowIsCollapsed,
}) => {
  return (
    <span
      onClick={onClick}
      className={joinClassNames([
        mod.rowElement,
        [mod.rowElementHead, isHead],
        [mod.rowElementCollapsedRow, rowIsCollapsed],
      ])}
    >
      <span>{text}</span>
      {icon && <Icon name={icon} size={16} />}
    </span>
  );
};
