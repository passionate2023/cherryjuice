import * as React from 'react';
import mod from './row.scss';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { RowElement, RowElementsProps } from './row-element/row-element';
import { Draggable } from '::app/components/editor/document/components/tree/components/node/_/draggable';

export type RowProps = {
  onClick?: (rowId: string) => void;
  onDoubleClick?: (rowId: string) => void;
  elements: RowElementsProps[];
  isHeader?: boolean;
  isCollapsed?: boolean;
  id: string;
  pinned?: boolean;
  state?: {
    opened?: boolean;
    active?: boolean;
    draggable?: boolean;
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
  pinned,
}) => {
  const [head, ...tail] = elements;
  return (
    <Draggable anchorId={id} anchorIndex={0}>
      {(provided, ref) => (
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
          data-cmi-context={JSON.stringify({ pinned })}
          ref={ref}
          {...(state.draggable && provided)}
        >
          <RowElement
            {...head}
            isHead={true}
            rowIsCollapsed={isCollapsed}
            rowId={id}
          />
          {!isCollapsed && (
            <span className={mod.row__tail}>
              {tail.map((element, i) => (
                <RowElement key={`${id}/${i}/${element.text}`} {...element} />
              ))}
            </span>
          )}
        </div>
      )}
    </Draggable>
  );
};

export { mod as modRow };
