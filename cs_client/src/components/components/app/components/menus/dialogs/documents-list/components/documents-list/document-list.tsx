import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { DocumentGroup } from './components/document-group';
import { CachedDocument } from '::store/ducks/cache/document-cache';
import { useMemo } from 'react';
import { SearchInput } from '::root/components/shared-components/inputs/search-input';
import { ac } from '::store/store';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { getDocumentsList } from '::store/selectors/cache/document/document';
import { SearchHeaderContainer } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-header/search-header';
import { DialogBody } from '../../../search-dialog/components/search-body/search-body';
import { adjustDialogBodyHeight } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/search-results';

const mapState = (state: Store) => ({
  dialogBodyHeight: state.cssVariables.dialogBodyHeight,
  show: state.dialogs.showDocumentList,
  documents: getDocumentsList(state),
  query: state.documentsList.query,
  isOnMd: state.root.isOnMd,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const DocumentList: React.FC<Props & PropsFromRedux> = ({
  documents,
  show,
  query,
  dialogBodyHeight,
  isOnMd,
}) => {
  const filesPerFolders: [string, CachedDocument[]][] = useMemo(() => {
    const categoriesDict = documents
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .reduce((acc, val) => {
        if (!query || val.name.toLowerCase().includes(query.toLowerCase())) {
          const folder = val.folder || 'Default group';
          if (acc[folder]) {
            acc[folder].push(val);
          } else acc[folder] = [val];
        }

        return acc;
      }, {});

    return Object.entries(categoriesDict);
  }, [documents]);
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
      </SearchHeaderContainer>
      <div
        className={modSearchDialog.searchDialog__searchResults}
        style={{
          height: adjustDialogBodyHeight(dialogBodyHeight, false, 0) + 10,
        }}
      >
        <div className={modSearchDialog.searchDialog__searchResults__list}>
          {filesPerFolders.map(([folder, documents]) => (
            <DocumentGroup key={folder} folder={folder} documents={documents} />
          ))}
        </div>
      </div>
    </DialogBody>
  );
};

const _ = connector(DocumentList);
export { _ as DocumentList };
