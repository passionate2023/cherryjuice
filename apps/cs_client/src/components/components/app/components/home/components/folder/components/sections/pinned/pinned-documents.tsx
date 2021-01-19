import * as React from 'react';
import {
  Table,
  SectionProps,
} from '::app/components/home/components/folder/components/sections/components/section/table';
import { ac } from '::store/store';

export type PinnedDocumentsProps = Omit<
  SectionProps,
  'header' | 'onRowClick' | 'onRowDoubleClick'
>;

const header = { id: 'header', elements: [{ text: 'Pinned' }], isPinned: true };

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
