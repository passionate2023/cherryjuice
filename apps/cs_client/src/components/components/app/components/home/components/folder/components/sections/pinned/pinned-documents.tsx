import * as React from 'react';
import {
  Table,
  SectionProps,
} from '::app/components/home/components/folder/components/sections/components/section/table';
import { ac } from '::store/store';
import { RowProps } from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';

export type PinnedDocumentsProps = Omit<
  SectionProps,
  'header' | 'onRowClick' | 'onRowDoubleClick'
>;

const header: RowProps = {
  id: 'header',
  elements: [{ text: 'Pinned' }],
  isHeader: true,
};

export const PinnedDocuments: React.FC<PinnedDocumentsProps> = ({
  rows,
  cmItems,
}) => {
  return (
    <Table
      collapsed={true}
      rows={rows}
      header={header}
      onRowClick={ac.home.selectDocument}
      onRowDoubleClick={ac.document.setDocumentId}
      cmItems={cmItems}
    />
  );
};
