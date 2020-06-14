import * as React from 'react';
import { useState } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { DocumentList } from './components/documents-list/document-list';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { modDialog } from '::sass-modules/index';
import { Icons, Icon } from '::shared-components/icon';
import { useDeleteFile } from '::hooks/graphql/delete-file';
import { useRef } from 'react';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { useGetDocumentsList } from '::app/menus/select-file/hooks/get-documents-list';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ac, Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';

const createButtons = ({ selectedIDs, documentId, close, open }) => {
  const buttonsLeft = [
    {
      label: 'reload',
      onClick: ac.dialogs.reloadDocumentList,
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
      disabled: selectedIDs[0] === documentId || selectedIDs.length !== 1,
    },
  ];
  return { buttonsLeft, buttonsRight };
};

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  showImportDocuments: state.dialogs.showImportDocuments,
  showDocumentList: state.dialogs.showDocumentList,
  reloadDocumentList: state.dialogs.reloadDocumentList,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SelectFile: React.FC<{
  isOnMobile;
} & PropsFromRedux> = ({
  documentId,
  reloadDocumentList,
  showDocumentList,
  isOnMobile,
}) => {
  const [selectedIDs, setSelectedIDs] = useState([]);
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
  });

  const { loading, documentsList } = useGetDocumentsList({
    reloadFiles: reloadDocumentList,
  });

  const { deleteDocument } = useDeleteFile({
    IDs: selectedIDs,
    onCompleted: () => {
      ac.dialogs.reloadDocumentList();
      if (selectedIDs.includes(documentId)) {
        ac.document.setDocumentId(undefined);
      }
    },
  });
  const holdingRef = useRef(false);
  const rightHeaderButtons = [
    documentsList.length && holdingRef.current && (
      <ButtonCircle
        key={Icons.material.clear}
        className={modDialog.dialog__header__fileButton}
        onClick={() => {
          setSelectedIDs([selectedIDs.pop()]);
          holdingRef.current = false;
        }}
      >
        <Icon name={Icons.material.cancel} />
      </ButtonCircle>
    ),
    documentsList.length && holdingRef.current && (
      <ButtonCircle
        disabled={!selectedIDs.length}
        key={Icons.material.delete}
        className={modDialog.dialog__header__fileButton}
        onClick={deleteDocument}
      >
        <Icon name={Icons.material['delete']} />
      </ButtonCircle>
    ),
  ].filter(Boolean);
  const onSelect = ({ id, holding }) => {
    const unselectElement = selectedIDs.includes(id);
    const clickDuringHolding = !holding && holdingRef.current;
    if (holding) {
      setSelectedIDs(selectedIDs => [...selectedIDs, id]);
      holdingRef.current = true;
    } else if (clickDuringHolding) {
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
          onSelect={onSelect}
          selectedIDs={selectedIDs}
          documentId={documentId}
          documentsMeta={documentsList}
          loading={loading}
        />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(SelectFile);
