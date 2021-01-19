import * as React from 'react';
import mod from './folder.scss';
import { Header } from '::app/components/home/components/folder/components/header/header';
import { AllDocuments } from '::app/components/home/components/folder/components/sections/folder/all-documents';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { useRowContextMenuItems } from '::app/components/home/components/folder/hooks/row-context-menu-items';
import { useSortDocuments } from '::app/components/home/components/folder/hooks/sort-documents';
import { LinearProgress } from '::shared-components/loading-indicator/linear-progress';

const mapState = (state: Store) => ({
  documents: Object.values(state.documentCache.documents),
  folder: state.home.folder,
  openedDocumentId: state.document.documentId,
  activeDocumentId: state.home.activeDocumentId,
  online: state.root.online,
  sortBy: state.home.sortBy,
  sortDirection: state.home.sortDirection,
  query: state.home.query,
  isOnMd: state.root.isOnMd,
  loading: state.documentsList.fetchDocuments === 'in-progress',
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type FolderProps = Record<string, never>;
const Folder: React.FC<FolderProps & PropsFromRedux> = ({
  documents,
  folder: folderName,
  activeDocumentId,
  openedDocumentId,
  online,
  sortBy,
  sortDirection,
  query,
  isOnMd,
  loading,
}) => {
  const sorted = useSortDocuments({
    documents,
    openedDocumentId,
    activeDocumentId,
    sortDirection,
    sortBy,
    query,
  });
  const folder = sorted[folderName];
  const rows = folder?.rows || [];
  const isEmpty = rows.length === 0;
  // const pinned = isEmpty ? [] : [rows[0], rows[1]].filter(Boolean);
  const rest = rows;
  const cmItems = useRowContextMenuItems({ online });
  return (
    <div className={mod.folder}>
      <Header
        folderName={folder?.folderName}
        query={query}
        noSearch={isEmpty}
      />
      <div className={mod.folder__tables}>
        <LinearProgress loading={loading} />
        {!loading && (
          <>
            {/*<PinnedDocuments rows={pinned} cmItems={cmItems} />*/}
            <AllDocuments
              rows={rest}
              cmItems={cmItems}
              sortBy={sortBy}
              sortDirection={sortDirection}
              isOnMd={isOnMd}
            />
          </>
        )}
      </div>
    </div>
  );
};

const _ = connector(Folder);
export { _ as Folder };
