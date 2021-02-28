import * as React from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Bookmarks } from '::root/components/app/components/menus/dialogs/bookmarks/components/bookmarks';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useDeleteListItems } from '::root/components/app/components/menus/dialogs/documents-list/hooks/delete-list-items';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    shown: state.dialogs.showBookmarks,
    documentId: state.document.documentId,
    selectedIDs: state.bookmarks.selectedIDs,
    bookmarks: document?.persistedState?.bookmarks,
    deletionMode: state.bookmarks.deletionMode,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    pinned: state.root.dockedDialog,
  };
};
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const BookmarksDialog: React.FC<PropsFromRedux> = ({
  shown,
  bookmarks = [],
  selectedIDs,
  selectedNode_id,
  documentId,
  deletionMode,
  pinned,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const closeDialog = ac.dialogs.hideBookmarksDialog;
  const buttonsRight: TDialogFooterButton[] = [
    { label: 'close', onClick: closeDialog },
    {
      label: 'open',
      disabled: selectedIDs.length !== 1 || selectedIDs[0] === selectedNode_id,
      onClick: () => ac.node.select({ node_id: selectedIDs[0], documentId }),
    },
  ];

  const rightHeaderButtons = useDeleteListItems({
    deletionMode,
    hidden: bookmarks.length === 0,
    disableDeletionMode: ac.bookmarks.disableDeletionMode,
    enableDeletionMode: ac.bookmarks.enableDeletionMode,
    selectAll: () => ac.bookmarks.selectAll(bookmarks),
    numberOfSelectedElements: bookmarks.length,
    performDeletion: () =>
      ac.documentCache.removeBookmark({ documentId, node_ids: selectedIDs }),
  });

  return (
    <DialogWithTransition
      dialogTitle={'Bookmarks'}
      footerLeftButtons={[]}
      footRightButtons={buttonsRight}
      rightHeaderButtons={rightHeaderButtons}
      isOnMobile={mbOrTb}
      show={shown}
      onClose={closeDialog}
      pinned={pinned}
      pinnable={true}
      loading={false}
    >
      <ErrorBoundary>
        <Bookmarks />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(BookmarksDialog);
