import * as React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { DialogBody } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/search-body';
import {
  SearchHeaderContainer,
  SearchHeaderGroup,
} from '::root/components/shared-components/dialog/animations/search-header-container';
import {
  Bookmark,
  BookmarkProps,
} from '::root/components/app/components/menus/dialogs/bookmarks/components/components/bookmark';
import { DialogScrollableSurface } from '::root/components/shared-components/dialog/dialog-list/dialog-scrollable-surface';
import { DialogCard } from '::root/components/shared-components/dialog/dialog-list/dialog-card';
import { SortOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/sort-options';
import { Icons } from '::root/components/shared-components/icon/icon';
import { SearchSetting } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/search-filters';
import { SortDirection, SortNodesBy } from '@cherryjuice/graphql-types';
import {
  mapSortNodesBy,
  PartialNode,
} from '::root/components/app/components/menus/dialogs/bookmarks/components/helpers/sort';
import { SearchInput } from '::root/components/shared-components/inputs/search-input';
import { modSearchDialog } from '::sass-modules';
import { useMemo } from 'react';

const options: { optionName: SortNodesBy }[] = [
  // @ts-ignore
  { optionName: 'Default' },
  { optionName: SortNodesBy.UpdatedAt },
  { optionName: SortNodesBy.CreatedAt },
  { optionName: SortNodesBy.NodeName },
  // { optionName: SortNodesBy.DocumentName },
];

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    bookmarks: document?.persistedState?.bookmarks,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    nodes: document?.nodes,
    documentId: document?.id,
    selectedIDs: state.bookmarks.selectedIDs,
    deletionMode: state.bookmarks.deletionMode,
    currentSortOptions: state.bookmarks.sortOptions,
    showSortOptions: state.bookmarks.showSortOptions,
    showDialog: state.dialogs.showBookmarks,
    query: state.bookmarks.query,
    isOnMd: state.root.isOnMd,
  };
};
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Bookmarks: React.FC<Props & PropsFromRedux> = ({
  selectedNode_id,
  bookmarks = [],
  nodes,
  showSortOptions,
  currentSortOptions,
  selectedIDs,
  documentId,
  deletionMode,
  query,
  showDialog,
  isOnMd,
}) => {
  const bookmarkProps = useMemo(() => {
    let bookmarkProps: (BookmarkProps & PartialNode)[] = bookmarks.map(
      (node_id, i) => {
        const node = nodes[node_id];
        return {
          name: nodes[node_id].name,
          node_id: nodes[node_id].node_id,
          createdAt: node.createdAt,
          updatedAt: node.updatedAt,
          i,
        };
      },
    );

    if (query)
      bookmarkProps = bookmarkProps.filter(node =>
        node.name.toLowerCase().includes(query.toLowerCase()),
      );
    // @ts-ignore
    if (currentSortOptions.sortBy !== 'Default') {
      bookmarkProps = mapSortNodesBy[currentSortOptions.sortBy](
        bookmarkProps,
      ) as (BookmarkProps & PartialNode)[];
      if (currentSortOptions.sortDirection === SortDirection.Descending)
        bookmarkProps = bookmarkProps.reverse();
    }
    return bookmarkProps;
  }, [bookmarks, currentSortOptions, query, nodes]);

  return (
    <DialogBody>
      <SearchHeaderContainer>
        <SearchHeaderGroup>
          <SearchInput
            containerClassName={modSearchDialog.searchDialog__header__field}
            placeHolder={'filter by node name'}
            value={query}
            onChange={ac.bookmarks.setQuery}
            onClear={ac.bookmarks.clearQuery}
            lazyAutoFocus={!isOnMd && showDialog ? 1200 : 0}
            searchImpossible={!bookmarks.length}
          />
          <SearchSetting
            iconName={Icons.material.sort}
            hide={ac.bookmarks.toggleSortOptions}
            show={ac.bookmarks.toggleSortOptions}
            shown={showSortOptions}
          >
            <SortOptions
              options={options}
              setSortBy={ac.bookmarks.setSortBy}
              toggleSortDirection={ac.bookmarks.toggleSortDirection}
              currentSortOptions={currentSortOptions}
              label={'sort by'}
            />
          </SearchSetting>
        </SearchHeaderGroup>
      </SearchHeaderContainer>
      <DialogScrollableSurface>
        {!!bookmarkProps.length && (
          <DialogCard
            items={bookmarkProps.map((node, i) => (
              <Bookmark
                key={node.node_id}
                {...node}
                active={!deletionMode && selectedNode_id === node.node_id}
                selected={selectedIDs.includes(node.node_id)}
                documentId={documentId}
                i={i}
                numberOfBookmarks={bookmarkProps.length}
              />
            ))}
          />
        )}
      </DialogScrollableSurface>
    </DialogBody>
  );
};
const _ = connector(Bookmarks);
export { _ as Bookmarks };
