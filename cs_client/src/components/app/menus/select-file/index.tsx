import * as React from 'react';
import { useEffect, useState } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { DocumentList } from './components/documents-list/document-list';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { modDialog } from '::sass-modules/index';
import { Icons, Icon } from '::shared-components/icon/icon';
import { useDeleteFile } from './hooks/delete-documents/delete-file';
import { useRef } from 'react';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ac, Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import { testIds } from '::cypress/support/helpers/test-ids';

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
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SelectFile: React.FC<PropsFromRedux> = ({
  documentId,
  showDocumentList,
  isOnMobile,
  documents,
  loading,
}) => {
  useEffect(() => {
    if (showDocumentList) ac.documentsList.fetchDocuments();
  }, [showDocumentList]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const close = ac.dialogs.hideDocumentList;
  const open = () => {
    updateCachedHtmlAndImages();
    ac.document.setDocumentId(selectedIDs[0]);
  };
  const holdingRef = useRef(false);
  const { buttonsLeft, buttonsRight } = createButtons({
    selectedIDs,
    documentId,
    close,
    open,
    deleteMode: holdingRef.current,
  });

  const { deleteDocument } = useDeleteFile({
    IDs: selectedIDs,
    onCompleted: () => {
      ac.documentsList.fetchDocuments();
      if (selectedIDs.includes(documentId)) {
        ac.document.setDocumentId(undefined);
      }
    },
  });

  const rightHeaderButtons = [
    documents.length && !holdingRef.current && (
      <ButtonCircle
        key={Icons.material['delete-sweep']}
        className={modDialog.dialog__header__fileButton}
        onClick={() => {
          holdingRef.current = true;
          setSelectedIDs([]);
        }}
      >
        <Icon {...{ name: Icons.material['delete-sweep'] }} />
      </ButtonCircle>
    ),
    documents.length && holdingRef.current && (
      <ButtonCircle
        key={Icons.material.clear}
        className={modDialog.dialog__header__fileButton}
        onClick={() => {
          setSelectedIDs([selectedIDs.pop()]);
          holdingRef.current = false;
        }}
      >
        <Icon {...{ name: Icons.material.cancel }} />
      </ButtonCircle>
    ),
    documents.length && holdingRef.current && (
      <ButtonCircle
        disabled={!selectedIDs.length}
        key={Icons.material.delete}
        className={modDialog.dialog__header__fileButton}
        onClick={deleteDocument}
      >
        <Icon
          name={Icons.material['delete']}
          testId={testIds.dialogs__selectDocument__header__buttons__delete}
        />
      </ButtonCircle>
    ),
  ].filter(Boolean);
  const onSelect = ({ id }) => {
    const unselectElement = selectedIDs.includes(id);
    const clickDuringHolding = holdingRef.current;
    if (clickDuringHolding) {
      if (unselectElement)
        setSelectedIDs(selectedIDs => [...selectedIDs.filter(x => x !== id)]);
      else setSelectedIDs(selectedIDs => [...selectedIDs, id]);
    } else {
      setSelectedIDs([id]);
    }
  };
  return (
    <DialogWithTransition
      dialogTitle={'Select Document'}
      dialogFooterLeftButtons={buttonsLeft}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMobile}
      show={showDocumentList}
      onClose={close}
      rightHeaderButtons={rightHeaderButtons}
    >
      <ErrorBoundary>
        <DocumentList
          deleteMode={holdingRef.current}
          onSelect={onSelect}
          selectedIDs={selectedIDs}
          documentId={documentId}
          documentsMeta={documents}
          loading={loading}
        />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(SelectFile);
