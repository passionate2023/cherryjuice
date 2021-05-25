import * as React from 'react';
import mod from './rows-container.scss';
import {
  Row,
  RowProps,
} from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { MutableRefObject } from 'react';

export type SectionBodyProps = {
  rows: RowProps[];
  collapsed?: boolean;
  onRowClick: (param: string) => void;
  onRowDoubleClick: (param: string) => void;
  _ref?: MutableRefObject<HTMLDivElement>;
  onContextMenu?: (e) => void;
};

export const RowsContainer: React.FC<SectionBodyProps> = ({
  rows,
  collapsed,
  onRowClick,
  onRowDoubleClick,
  _ref,
  onContextMenu,
}) => {
  return (
    <div
      className={joinClassNames([
        mod.rowsContainer,
        [mod.rowsContainerCollapsed, collapsed],
      ])}
      ref={_ref}
      onContextMenu={onContextMenu}
    >
      {rows.map(row => (
        <Row
          key={row.id}
          {...row}
          onClick={onRowClick}
          onDoubleClick={onRowDoubleClick}
          isCollapsed={collapsed}
        />
      ))}
    </div>
  );
};
