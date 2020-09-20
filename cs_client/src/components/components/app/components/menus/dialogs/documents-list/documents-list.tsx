import * as React from 'react';
import { useEffect } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { DocumentList } from './components/documents-list/document-list';
import { modDialog } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { testIds } from '::cypress/support/helpers/test-ids';
import { DialogHeaderButton } from '::root/components/shared-components/dialog/dialog-header';
import { getDocumentsList } from '::store/selectors/cache/document/document';

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
      lazyAutoFocus: true,
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
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const DocumentsList: React.FC<PropsFromRedux> = ({
  documentId,
  showDocumentList,
  isOnMobile,
  documents,
  loading,
  deletionMode,
  selectedIDs,
  fetchDocuments,
  userId,
  online,
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
    updateCachedHtmlAndImages();
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

  const showDeletionButtons = !documents.length || !deletionMode;
  const rightHeaderButtons: DialogHeaderButton[] = [
    {
      hidden: !documents.length || deletionMode,
      disabled: !online,
      className: modDialog.dialog__header__fileButton,
      onClick: ac.documentsList.enableDeletionMode,
      icon: Icons.material['delete-sweep'],
      testId: testIds.dialogs__selectDocument__header__buttons__deleteSweep,
    },
    {
      hidden: showDeletionButtons,
      className: modDialog.dialog__header__fileButton,
      onClick: ac.documentsList.disableDeletionMode,
      icon: Icons.material.cancel,
    },
    {
      hidden: showDeletionButtons,
      className: modDialog.dialog__header__fileButton,
      onClick: () => ac.documentsList.selectAllDocuments(documents),
      icon: Icons.material['select-all'],
      testId: testIds.dialogs__selectDocument__header__buttons__deleteAll,
    },
    {
      hidden: showDeletionButtons,
      className: modDialog.dialog__header__fileButton,
      onClick: ac.dialogs.showDeleteDocument,
      icon: Icons.material['delete'],
      testId: testIds.dialogs__selectDocument__header__buttons__delete,
      disabled: selectedIDs.length === 0,
    },
  ];

  return (
    <DialogWithTransition
      dialogTitle={'Select Document'}
      dialogFooterLeftButtons={buttonsLeft}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMobile}
      show={showDocumentList}
      onClose={close}
      rightHeaderButtons={rightHeaderButtons}
      docked={false}
      loading={fetchDocuments !== 'idle'}
    >
      <ErrorBoundary>
        <DocumentList documents={documents} loading={loading} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(DocumentsList);
