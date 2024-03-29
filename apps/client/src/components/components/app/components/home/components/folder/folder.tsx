import * as React from 'react';
import mod from './folder.scss';
import { Header } from '::app/components/home/components/folder/components/header/header';
import { AllDocuments } from '::app/components/home/components/folder/components/sections/folder/all-documents';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { useRowContextMenuItems } from '::app/components/home/components/folder/hooks/row-context-menu-items';
import { useSortDocuments } from '::app/components/home/components/folder/hooks/sort-documents';
import { Portal } from '@cherryjuice/components';
import { modHome } from '::app/components/home/home';
import { PinnedDocuments } from '::app/components/home/components/folder/components/sections/pinned/pinned-documents';
import {
  createInlineInputProviderContext,
  useInlineInputProvider,
} from '::shared-components/inline-input/hooks/inline-input-provider';
import { getDocuments } from '::store/selectors/cache/document/document';
import { useCurrentBreakpoint, useLoader } from '@cherryjuice/shared-helpers';
import { DocumentsListSkeleton } from '::app/components/home/components/folder/components/folder-skeleton/documents-list-skeleton';

export const FolderContext = createInlineInputProviderContext();

const mapState = (state: Store) => ({
  documents: Object.values(state.documentCache.documents),
  folder: state.home.folder,
  draftsFolderId: state.home.draftsFolderId,
  openedDocumentId: state.document.documentId,
  activeDocumentId: state.home.activeDocumentId,
  isOwnerOfActiveDocument:
    getDocuments(state)?.[state.home.activeDocumentId]?.userId ===
    state.auth.user?.id,
  online: state.root.online,
  sortBy: state.home.sortBy,
  sortDirection: state.home.sortDirection,
  query: state.home.query,
  folders: state.home.folders,
  loading: state.documentsList.asyncOperations.fetchDocuments === 'in-progress',
  showSidebar: state.home.showSidebar,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type FolderProps = Record<string, never>;
const Folder: React.FC<PropsFromRedux> = ({
  documents,
  folder: currentFolder,
  draftsFolderId,
  folders,
  activeDocumentId,
  openedDocumentId,
  online,
  sortBy,
  sortDirection,
  query,
  loading,
  isOwnerOfActiveDocument,
  showSidebar,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const sorted = useSortDocuments({
    documents,
    openedDocumentId,
    activeDocumentId,
    sortDirection,
    sortBy,
    query,
    draftsFolderId,
    folders,
    draggable: (mbOrTb && showSidebar) || !mbOrTb,
  });
  const inlineInputProps = useInlineInputProvider({
    disable: !isOwnerOfActiveDocument,
    onApply: (id, value) =>
      ac.documentCache.mutateDocument({
        documentId: id,
        meta: { name: value.trim() },
      }),
    onDiscard: () => undefined,
  });
  const folder = sorted[currentFolder.id];
  const rows = folder?.rows || [];
  const pinned = folder?.pinned || [];
  const cmItems = useRowContextMenuItems({
    online,
    rename: id => inlineInputProps.enableInput(id)(),
    isOwnerOfActiveDocument,
  });
  const folderName = folders[currentFolder.id]?.name;
  const showSkeleton = useLoader({
    waitBeforeShowing: 1000,
    minimumLoadingDuration: 1000,
    loading: loading && !(pinned.length || rows.length),
  });
  return (
    <FolderContext.Provider value={inlineInputProps}>
      <div className={mod.folder}>
        <Portal targetSelector={'.' + modHome.home} predicate={mbOrTb}>
          <Header folderName={folderName} query={query} mbOrTb={mbOrTb} />
        </Portal>
        <div className={mod.folder__tables}>
          {showSkeleton ? (
            <DocumentsListSkeleton />
          ) : (
            <>
              {pinned.length > 0 && (
                <PinnedDocuments rows={pinned} cmItems={cmItems} />
              )}
              {rows.length > 0 && (
                <AllDocuments
                  rows={rows}
                  cmItems={cmItems}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />
              )}
            </>
          )}
        </div>
      </div>
    </FolderContext.Provider>
  );
};

const _ = connector(Folder);
export { _ as Folder };
