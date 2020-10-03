import * as React from 'react';
import { useMemo } from 'react';
import { modSearchDialog } from '::sass-modules';
import { DocumentGroup } from './components/document-group';
import { CachedDocument } from '::store/ducks/cache/document-cache';
import { SearchInput } from '::root/components/shared-components/inputs/search-input';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getDocumentsList } from '::store/selectors/cache/document/document';
import {
  SearchHeaderContainer,
  SearchHeaderGroup,
} from '::root/components/shared-components/dialog/animations/search-header-container';
import { DialogBody } from '../../../search-dialog/components/search-body/search-body';
import { SortOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/sort-options';
import { SortDirection, SortNodesBy } from '::types/graphql';
import { Icons } from '::root/components/shared-components/icon/icon';
import { SearchSetting } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/search-filters';
import { DialogScrollableSurface } from '::root/components/shared-components/dialog/dialog-list/dialog-scrollable-surface';
import { mapSortDocumentBy } from '::root/components/app/components/menus/dialogs/bookmarks/components/helpers/sort';

const options: { optionName: SortNodesBy }[] = [
  { optionName: SortNodesBy.UpdatedAt },
  { optionName: SortNodesBy.CreatedAt },
  { optionName: SortNodesBy.DocumentName },
];

const mapState = (state: Store) => ({
  show: state.dialogs.showDocumentList,
  documents: getDocumentsList(state),
  query: state.documentsList.query,
  showFilters: state.documentsList.showFilters,
  currentSortOptions: state.documentsList.sortOptions,
  isOnMd: state.root.isOnMd,
  pinned: state.root.dockedDialog,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const DocumentList: React.FC<Props & PropsFromRedux> = ({
  documents,
  show,
  query,
  isOnMd,
  currentSortOptions,
  showFilters,
}) => {
  const filesPerFolders: [string, CachedDocument[]][] = useMemo(() => {
    let sortedDocuments: CachedDocument[] = mapSortDocumentBy[
      currentSortOptions.sortBy
    ](documents);
    if (currentSortOptions.sortDirection === SortDirection.Descending)
      sortedDocuments = sortedDocuments.reverse();
    const categoriesDict = sortedDocuments.reduce((acc, val) => {
      if (!query || val.name.toLowerCase().includes(query.toLowerCase())) {
        const folder = val.folder || 'Default group';
        if (acc[folder]) {
          acc[folder].push(val);
        } else acc[folder] = [val];
      }
      return acc;
    }, {});

    return Object.entries(categoriesDict);
  }, [documents, currentSortOptions]);

  return (
    <DialogBody>
      <SearchHeaderContainer>
        <SearchHeaderGroup>
          <SearchInput
            containerClassName={modSearchDialog.searchDialog__header__field}
            placeHolder={'find documents'}
            value={query}
            onChange={ac.documentsList.setQuery}
            onClear={ac.documentsList.clearQuery}
            lazyAutoFocus={!isOnMd && show ? 1200 : 0}
            searchImpossible={!documents.length}
          />
          <SearchSetting
            iconName={Icons.material.sort}
            hide={ac.documentsList.toggleFilters}
            show={ac.documentsList.toggleFilters}
            shown={showFilters}
          >
            <SortOptions
              options={options}
              setSortBy={ac.documentsList.setSortBy}
              toggleSortDirection={ac.documentsList.toggleSortDirection}
              currentSortOptions={currentSortOptions}
              label={'sort by'}
            />
          </SearchSetting>
        </SearchHeaderGroup>
      </SearchHeaderContainer>
      <DialogScrollableSurface>
        {filesPerFolders.map(([folder, documents]) => (
          <DocumentGroup key={folder} folder={folder} documents={documents} />
        ))}
      </DialogScrollableSurface>
    </DialogBody>
  );
};

const _ = connector(DocumentList);
export { _ as DocumentList };
