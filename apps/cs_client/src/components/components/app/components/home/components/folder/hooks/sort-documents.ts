import { CachedDocument } from '::store/ducks/document-cache/document-cache';
import { useMemo } from 'react';
import { SortDirection } from '@cherryjuice/graphql-types';
import { FoldersDict, SortDocumentsBy } from '::store/ducks/home/home';
import { RowProps } from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';
import {
  formatAbsolutTime,
  timeAgo,
} from '::hooks/relative-time/relative-time';
import { mapPrivacyToIcon } from '::app/components/editor/info-bar/components/components/visibility-icon';
import { IconName } from '@cherryjuice/icons';

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
  folders: FoldersDict;
  draggable: boolean;
};

type SortedDocuments = Record<string, { rows: RowProps[]; pinned: RowProps[] }>;

export const useSortDocuments = ({
  documents,
  sortBy,
  sortDirection,
  query,
  openedDocumentId,
  activeDocumentId,
  draftsFolderId,
  folders,
  draggable,
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

      const documentFolderIdIsValid =
        document.folderId && folders[document.folderId];
      const documentFolderId = documentFolderIdIsValid
        ? document.folderId
        : draftsFolderId;
      if (!acc[documentFolderId])
        acc[documentFolderId] = { rows: [], pinned: [] };
      if (matchesSearchFilter) {
        const row: RowProps = {
          id: document.id,
          pinned: document.persistedState.pinned,
          elements: [
            document.name,
            [
              timeAgo.format(document.updatedAt, 'round'),
              formatAbsolutTime(document.updatedAt),
            ],
            [
              timeAgo.format(document.createdAt, 'round'),
              formatAbsolutTime(document.createdAt),
            ],
            document.size,
          ].map((text, i) => {
            const hasTooltip = Array.isArray(text);
            return {
              text: hasTooltip ? text[0] : text,
              tooltip: hasTooltip ? text[1] : undefined,
              icon: i === 0 && (mapPrivacyToIcon(document.privacy) as IconName),
            };
          }),
          state: {
            opened: openedDocumentId === document.id,
            active: activeDocumentId === document.id,
            draggable,
          },
        };

        if (document.persistedState.pinned)
          acc[documentFolderId].pinned.push(row);
        else acc[documentFolderId].rows.push(row);
      }
      return acc;
    }, {});
  }, [
    documents,
    sortBy,
    sortDirection,
    query,
    openedDocumentId,
    activeDocumentId,
    folders,
    draggable,
  ]);
};
