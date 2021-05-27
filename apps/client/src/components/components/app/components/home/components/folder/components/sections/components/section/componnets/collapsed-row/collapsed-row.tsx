import * as React from 'react';
import { Icon } from '@cherryjuice/icons';
import mod from './collapsed-row.scss';
import { RowProps } from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';

export const CollapsedRow: React.FC<RowProps> = ({
  elements,
  onClick,
  onDoubleClick,
  id,
  onElementClick,
}) => {
  const { text, icon } = elements[0];
  return (
    <div
      className={mod.collapsedRow}
      onClick={onClick ? () => onClick(id) : undefined}
      onDoubleClick={onDoubleClick ? () => onDoubleClick(id) : undefined}
    >
      <span
        key={text}
        className={mod.row__cell}
        onClick={onElementClick ? () => onElementClick(text) : undefined}
      >
        {text} <Icon name={icon} size={16} />
      </span>
    </div>
  );
};
