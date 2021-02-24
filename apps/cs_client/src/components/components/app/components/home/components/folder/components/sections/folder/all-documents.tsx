import * as React from 'react';
import { Table } from '::app/components/home/components/folder/components/sections/components/section/table';
import { ac } from '::store/store';
import { SortDocumentsBy } from '::store/ducks/home/home';
import { SortDirection } from '@cherryjuice/graphql-types';
import { mapEnumToReadableText } from '::app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';
import { PinnedDocumentsProps } from '::app/components/home/components/folder/components/sections/pinned/pinned-documents';
import { useCurrentBreakpoint } from '::hooks/current-breakpoint';

type Props = PinnedDocumentsProps & {
  sortBy: SortDocumentsBy;
  sortDirection: SortDirection;
};

export const AllDocuments: React.FC<Props> = ({
  rows,
  cmItems,
  sortBy,
  sortDirection,
}) => {
  const folderHeader = {
    elements: [
      SortDocumentsBy.DocumentName,
      SortDocumentsBy.UpdatedAt,
      SortDocumentsBy.CreatedAt,
      SortDocumentsBy.Size,
    ].map(text => ({
      text: mapEnumToReadableText(text, 'cap-first-letter').replace(/ at$/, ''),
      onClick: () => ac.home.setSortBy({ sortBy: text }),
      icon:
        sortBy === text &&
        (sortDirection === SortDirection.Ascending ? 'arrow-up' : 'arrow-down'),
    })),
    id: 'header',
    isHeader: true,
  };
  const { mbOrTb } = useCurrentBreakpoint();
  return (
    <Table
      rows={rows}
      header={folderHeader}
      onRowClick={ac.home.selectDocument}
      onRowDoubleClick={ac.document.setDocumentId}
      cmItems={cmItems}
      collapsed={mbOrTb}
    />
  );
};
