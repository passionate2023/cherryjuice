import * as React from 'react';
import { useMemo } from 'react';
import { modSearchDialog } from '::sass-modules';
import { DocumentGroup } from './components/document-group';
import { CachedDocument } from '::store/ducks/cache/document-cache';
import { SearchInput } from '::root/components/shared-components/inputs/search-input';
import { ac, Store } from '::store/store';

import { connect, ConnectedProps } from 'react-redux';
import { getDocumentsList } from '::store/selectors/cache/document/document';
import { SearchHeaderContainer } from '::root/components/shared-components/dialog/animations/search-header-container';
import { DialogBody } from '../../../search-dialog/components/search-body/search-body';
import { AnimatedDialogHeader } from '::root/components/shared-components/dialog/animations/animated-dialog-filters';
import { SortOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/sort-options';
import { SortDirection, SortNodesBy } from '::types/graphql/generated';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { CollapsableDialogBody } from '::root/components/shared-components/dialog/animations/collapsable-dialog-body';

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

const sortByName = (xs: CachedDocument[]) =>
  xs.sort((a, b) => a.name.localeCompare(b.name));
const sortByUpdated = (xs: CachedDocument[]): CachedDocument[] =>
  xs.sort((a, b) => a.localState.localUpdatedAt - b.localState.localUpdatedAt);
const sortByCreated = (xs: CachedDocument[]): CachedDocument[] =>
  xs.sort((a, b) => a.createdAt - b.createdAt);

const mapSortBy = {
  [SortNodesBy.CreatedAt]: sortByCreated,
  [SortNodesBy.UpdatedAt]: sortByUpdated,
  [SortNodesBy.DocumentName]: sortByName,
};
type Props = {};
const DocumentList: React.FC<Props & PropsFromRedux> = ({
  documents,
  show,
  query,
  isOnMd,
  currentSortOptions,
  pinned,
  showFilters,
}) => {
  const filesPerFolders: [string, CachedDocument[]][] = useMemo(() => {
    let sortedDocuments: CachedDocument[] = mapSortBy[
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
        <SearchInput
          containerClassName={modSearchDialog.searchDialog__header__searchField}
          placeHolder={'find documents'}
          value={query}
          onChange={ac.documentsList.setQuery}
          onClear={ac.documentsList.clearQuery}
          lazyAutoFocus={!isOnMd && show ? 1200 : 0}
          searchImpossible={!documents.length}
        />
        <ButtonCircle
          className={modSearchDialog.searchDialog__header__toggleFilters}
          onClick={ac.documentsList.toggleFilters}
          icon={<Icon name={Icons.material.tune} loadAsInlineSVG={'force'} />}
          active={showFilters}
        />
      </SearchHeaderContainer>
      <AnimatedDialogHeader show={showFilters} pinned={pinned}>
        <SortOptions
          options={options}
          setSortBy={ac.documentsList.setSortBy}
          toggleSortDirection={ac.documentsList.toggleSortDirection}
          currentSortOptions={currentSortOptions}
          label={'sort documents by'}
        />
      </AnimatedDialogHeader>
      <CollapsableDialogBody collapse={showFilters} offset={15}>
        <div className={modSearchDialog.searchDialog__searchResults__list}>
          {filesPerFolders.map(([folder, documents]) => (
            <DocumentGroup key={folder} folder={folder} documents={documents} />
          ))}
        </div>
      </CollapsableDialogBody>
    </DialogBody>
  );
};

const _ = connector(DocumentList);
export { _ as DocumentList };
