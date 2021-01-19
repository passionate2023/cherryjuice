import * as React from 'react';
import mod from './row.scss';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { RowElement, RowElementsProps } from './row-element/row-element';

export type RowProps = {
  onClick?: (rowId: string) => void;
  onDoubleClick?: (rowId: string) => void;
  elements: RowElementsProps[];
  isHeader?: boolean;
  isCollapsed?: boolean;
  id: string;
  state?: {
    opened?: boolean;
    active?: boolean;
  };
};

export const Row: React.FC<RowProps> = ({
  id,
  isHeader,
  elements,
  state = {},
  onClick,
  onDoubleClick,
  isCollapsed,
}) => {
  const [head, ...tail] = elements;
  return (
    <div
      className={joinClassNames([
        mod.row,
        [mod.rowHeader, isHeader],
        [mod.rowActive, state.active],
        [mod.rowOpened, state.opened],
        [mod.rowCollapsed, isCollapsed],
      ])}
      onClick={onClick ? () => onClick(id) : undefined}
      onDoubleClick={onDoubleClick ? () => onDoubleClick(id) : undefined}
      data-row-id={id}
    >
      <RowElement {...head} isHead={true} rowIsCollapsed={isCollapsed} />
      {!isCollapsed && (
        <span className={mod.row__tail}>
          {tail.map((element, i) => (
            <RowElement key={`${id}/${i}/${element.text}`} {...element} />
          ))}
        </span>
      )}
    </div>
  );
};
