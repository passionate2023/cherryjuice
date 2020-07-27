import * as React from 'react';
import { useEffect } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { DocumentList } from './components/documents-list/document-list';
import { modDialog } from '::sass-modules/index';
import { Icons } from '::shared-components/icon/icon';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ac, Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import { testIds } from '::cypress/support/helpers/test-ids';
import { DialogHeaderButton } from '::shared-components/dialog/dialog-header';

const createButtons = ({
  selectedIDs,
  documentId,
  close,
  open,
  deleteMode,
}) => {
  const buttonsLeft = [
    {
      label: 'reload',
      onClick: ac.documentsList.fetchDocuments,
      disabled: false,
    },
    {
      label: 'import',
      onClick: ac.dialogs.showImportDocument,
      disabled: false,
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
  documents: state.documentsList.documents,
  loading: state.documentsList.fetchDocuments === 'in-progress',
  isOnMobile: state.root.isOnMobile,
  deletionMode: state.documentsList.deletionMode,
  selectedIDs: state.documentsList.selectedIDs,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SelectFile: React.FC<PropsFromRedux> = ({
  documentId,
  showDocumentList,
  isOnMobile,
  documents,
  loading,
  deletionMode,
  selectedIDs,
}) => {
  useEffect(() => {
    if (showDocumentList) ac.documentsList.fetchDocuments();
  }, [showDocumentList]);
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
  });

  const showDeletionButtons = !documents.length || !deletionMode;
  const rightHeaderButtons: DialogHeaderButton[] = [
    {
      hidden: !documents.length || deletionMode,
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
      onClick: ac.documentsList.selectAllDocuments,
      icon: Icons.material['select-all'],
    },
    {
      hidden: showDeletionButtons,
      className: modDialog.dialog__header__fileButton,
      onClick: ac.documentsList.deleteDocuments,
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
    >
      <ErrorBoundary>
        <DocumentList documentsMeta={documents} loading={loading} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(SelectFile);
