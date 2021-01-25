import { CachedDocument } from '::store/ducks/document-cache/document-cache';
import { useMemo } from 'react';
import { SortDirection } from '@cherryjuice/graphql-types';
import { SortDocumentsBy } from '::store/ducks/home/home';
import { RowProps } from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';
import { timeAgo } from '::hooks/relative-time/relative-time';
import { mapPrivacyToIcon } from '::app/components/editor/info-bar/components/components/visibility-icon';

const sortByDocumentName = (xs: CachedDocument[]) =>
  xs.sort((a, b) => a.name.localeCompare(b.name));
const sortByDocumentUpdated = (xs: CachedDocument[]): CachedDocument[] =>
  xs.sort((a, b) => a.updatedAt - b.updatedAt);
const sortByDocumentCreated = (xs: CachedDocument[]): CachedDocument[] =>
  xs.sort((a, b) => a.createdAt - b.createdAt);
const sortByDocumentSize = (xs: CachedDocument[]): CachedDocument[] =>
  xs.sort((a, b) => a.size - b.size);

export const mapSortDocumentBy = {
  [SortDocumentsBy.CreatedAt]: sortByDocumentCreated,
  [SortDocumentsBy.UpdatedAt]: sortByDocumentUpdated,
  [SortDocumentsBy.DocumentName]: sortByDocumentName,
  [SortDocumentsBy.Size]: sortByDocumentSize,
};

type Props = {
  sortBy: SortDocumentsBy;
  sortDirection: SortDirection;
  query: string;
  documents: CachedDocument[];
  openedDocumentId: string;
  activeDocumentId: string;
  draftsFolderId;
};

type SortedDocuments = Record<string, { rows: RowProps[] }>;

export const useSortDocuments = ({
  documents,
  sortBy,
  sortDirection,
  query,
  openedDocumentId,
  activeDocumentId,
  draftsFolderId,
}: Props) => {
  return useMemo<SortedDocuments>(() => {
    let sortedDocuments: CachedDocument[] = mapSortDocumentBy[sortBy](
      documents,
    );
    if (sortDirection === SortDirection.Descending)
      sortedDocuments = sortedDocuments.reverse();
    return sortedDocuments.reduce<SortedDocuments>((acc, document) => {
      const matchesSearchFilter =
        !query || document.name.toLowerCase().includes(query.toLowerCase());

      const documentFolderId = document.folderId || draftsFolderId;
      if (!acc[documentFolderId]) acc[documentFolderId] = { rows: [] };
      if (matchesSearchFilter)
        acc[documentFolderId].rows.push({
          id: document.id,
          elements: [
            document.name,
            timeAgo.format(document.updatedAt, 'round'),
            timeAgo.format(document.createdAt, 'round'),
            document.size,
          ].map((text, i) => ({
            text,
            icon: i === 0 && mapPrivacyToIcon(document.privacy),
          })),
          state: {
            opened: openedDocumentId === document.id,
            active: activeDocumentId === document.id,
          },
        });
      return acc;
    }, {});
  }, [
    documents,
    sortBy,
    sortDirection,
    query,
    openedDocumentId,
    activeDocumentId,
  ]);
};
