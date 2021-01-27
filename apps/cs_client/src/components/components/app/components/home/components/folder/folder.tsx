import * as React from 'react';
import mod from './folder.scss';
import { Header } from '::app/components/home/components/folder/components/header/header';
import { AllDocuments } from '::app/components/home/components/folder/components/sections/folder/all-documents';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { useRowContextMenuItems } from '::app/components/home/components/folder/hooks/row-context-menu-items';
import { useSortDocuments } from '::app/components/home/components/folder/hooks/sort-documents';
import { LinearProgress } from '::shared-components/loading-indicator/linear-progress';
import { Portal } from '::app/components/editor/tool-bar/tool-bar';
import { modHome } from '::app/components/home/home';
import { PinnedDocuments } from '::app/components/home/components/folder/components/sections/pinned/pinned-documents';
import {
  InlineInputProps,
  useInlineInputProvider,
} from '::shared-components/inline-input/hooks/inline-input-provider';
import { createContext } from 'react';

export const FolderContext = createContext<InlineInputProps>({});

const mapState = (state: Store) => ({
  documents: Object.values(state.documentCache.documents),
  folder: state.home.folder,
  draftsFolderId: state.home.draftsFolderId,
  openedDocumentId: state.document.documentId,
  activeDocumentId: state.home.activeDocumentId,
  online: state.root.online,
  sortBy: state.home.sortBy,
  sortDirection: state.home.sortDirection,
  query: state.home.query,
  folders: state.home.folders,
  isOnMd: state.root.isOnMd,
  loading: state.documentsList.fetchDocuments === 'in-progress',
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type FolderProps = Record<string, never>;
const Folder: React.FC<FolderProps & PropsFromRedux> = ({
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
    draftsFolderId,
    folders,
  });
  const inlineInputProps = useInlineInputProvider({
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
    rename: inlineInputProps.setCurrentlyEnabledInput,
  });
  const folderName = folders[currentFolder.id]?.name;
  return (
    <FolderContext.Provider value={inlineInputProps}>
      <div className={mod.folder}>
        <Portal targetSelector={'.' + modHome.home} predicate={isOnMd}>
          <Header
            folderName={folderName}
            query={query}
            noSearch={rows.length === 0 && pinned.length === 0}
            isOnMd={isOnMd}
          />
        </Portal>
        <div className={mod.folder__tables}>
          <LinearProgress loading={loading} />
          {!loading && (
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
                  isOnMd={isOnMd}
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
