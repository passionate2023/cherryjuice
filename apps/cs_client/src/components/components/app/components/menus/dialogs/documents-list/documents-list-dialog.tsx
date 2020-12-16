import * as React from 'react';
import { useEffect } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { DocumentList } from './components/documents-list/document-list';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { testIds } from '::cypress/support/helpers/test-ids';
import { getDocumentsList } from '::store/selectors/cache/document/document';
import { useDeleteListItems } from '::root/components/app/components/menus/dialogs/documents-list/hooks/delete-list-items';

const createButtons = ({
  selectedIDs,
  documentId,
  close,
  open,
  deleteMode,
  online,
}) => {
  const buttonsLeft = [
    {
      label: 'reload',
      onClick: ac.documentsList.fetchDocuments,
      disabled: !online,
    },
    {
      label: 'import',
      onClick: ac.dialogs.showImportDocument,
      disabled: !online,
      testId: testIds.dialogs__selectDocument__footerLeft__import,
    },
  ];
  const buttonsRight: TDialogFooterButton[] = [
    {
      label: 'close',
      onClick: close,
      disabled: false,
      testId: 'close-document-select',
    },
    {
      testId: testIds.dialogs__selectDocument__footerRight__open,
      label: 'open',
      onClick: open,
      disabled:
        deleteMode || selectedIDs[0] === documentId || selectedIDs.length !== 1,
    },
  ];
  return { buttonsLeft, buttonsRight };
};

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
  useEffect(() => {
    if (userId) ac.documentsList.fetchDocuments();
  }, []);
  useEffect(() => {
    if (online && showDocumentList) {
      const handle = setTimeout(ac.documentsList.fetchDocuments, 1500);
      return () => {
        clearInterval(handle);
      };
    }
  }, [showDocumentList, online]);
  const close = ac.dialogs.hideDocumentList;
  const open = () => {
    ac.document.setDocumentId(selectedIDs[0]);
  };
  const { buttonsLeft, buttonsRight } = createButtons({
    selectedIDs,
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

export default connector(DocumentsListDialog);
