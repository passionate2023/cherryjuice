import * as React from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { DocumentList } from './components/documents-list/document-list';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getDocumentsList } from '::store/selectors/cache/document/document';
import { useDeleteListItems } from '::root/components/app/components/menus/dialogs/documents-list/hooks/delete-list-items';
import { useFetchDocumentsList } from '::app/components/menus/dialogs/documents-list/hooks/fetch-documents-list';
import { memo, useCallback } from 'react';
import { useFooterButtons } from '::app/components/menus/dialogs/documents-list/hooks/footer-buttons';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  showImportDocuments: state.dialogs.showImportDocuments,
  showDocumentList: state.dialogs.showDocumentList,
  documents: getDocumentsList(state),
  loading: state.documentsList.fetchDocuments === 'in-progress',
  isOnMobile: state.root.isOnMd,
  deletionMode: state.documentsList.deletionMode,
  selectedIDs: state.documentsList.selectedIDs,
  fetchDocuments: state.documentsList.fetchDocuments,
  userId: state.auth.user?.id,
  online: state.root.online,
  docked: state.root.dockedDialog,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const DocumentsListDialog: React.FC<PropsFromRedux> = ({
  documentId,
  showDocumentList,
  isOnMobile,
  documents,
  deletionMode,
  selectedIDs,
  fetchDocuments,
  userId,
  online,
  docked,
}) => {
  useFetchDocumentsList({ userId, online, showDocumentList });

  const close = ac.dialogs.hideDocumentList;
  const selectedID = selectedIDs[0];
  const open = useCallback(() => {
    ac.document.setDocumentId(selectedID);
  }, [selectedID]);
  const [buttonsLeft, buttonsRight] = useFooterButtons({
    selectedID: selectedID,
    numberOfDocuments: selectedIDs.length,
    documentId,
    close,
    open,
    deleteMode: deletionMode,
    online,
  });

  const rightHeaderButtons = useDeleteListItems({
    deletionMode,
    hidden: !documents.length,
    disableDeletionMode: ac.documentsList.disableDeletionMode,
    enableDeletionMode: ac.documentsList.enableDeletionMode,
    selectAll: () => ac.documentsList.selectAllDocuments(documents),
    numberOfSelectedElements: selectedIDs.length,
    performDeletion: ac.dialogs.showDeleteDocument,
  });

  return (
    <DialogWithTransition
      dialogTitle={'Select Document'}
      footerLeftButtons={buttonsLeft}
      footRightButtons={buttonsRight}
      rightHeaderButtons={rightHeaderButtons}
      isOnMobile={isOnMobile}
      show={showDocumentList}
      onClose={close}
      pinned={docked}
      pinnable={true}
      loading={fetchDocuments !== 'idle'}
    >
      <ErrorBoundary>
        <DocumentList />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

const _ = connector(DocumentsListDialog);
const M = memo(_);
export default M;
