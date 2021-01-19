import * as React from 'react';
import mod from './table.scss';
import { RowProps } from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';
import {
  RowsContainer,
  SectionBodyProps,
} from '::app/components/home/components/folder/components/sections/components/section/componnets/section-body/rows-container';
import modRow from './componnets/row/row.scss';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';
import { CMItem } from '::shared-components/context-menu/context-menu-item';

export type SectionProps = SectionBodyProps & {
  header: RowProps;
  cmItems: CMItem[];
};

export const Table: React.FC<SectionProps> = ({
  collapsed,
  header,
  rows,
  onRowClick,
  onRowDoubleClick,
  cmItems,
}) => {
  const hookProps = {
    getIdOfActiveElement: target => {
      const row: HTMLElement = target.closest('.' + modRow.row);
      if (row) return row.dataset.rowId;
    },
    onSelectElement: rowId => {
      onRowClick(rowId);
    },
  };
  return (
    <div className={mod.table}>
      <RowsContainer
        rows={[header]}
        collapsed={collapsed}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
      />
      <ContextMenuWrapper hookProps={hookProps} items={cmItems}>
        {({ ref, show }) => (
          <RowsContainer
            rows={rows}
            collapsed={collapsed}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            _ref={ref}
            onContextMenu={show}
          />
        )}
      </ContextMenuWrapper>
    </div>
  );
};
