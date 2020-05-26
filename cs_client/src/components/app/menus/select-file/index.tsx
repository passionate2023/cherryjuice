import * as React from 'react';
import { useState } from 'react';
import { appActionCreators } from '../../reducer';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { DocumentList } from './components/documents-list/document-list';
import { CircleButton } from '::shared-components/buttons/circle-button';
import { modDialog } from '::sass-modules/index';
import { Icons, Icon } from '::shared-components/icon';
import { useDeleteFile } from '::hooks/graphql/delete-file';
import { useRef } from 'react';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { useGetDocumentsList } from '::app/menus/select-file/hooks/get-documents-list';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';

const createButtons = ({ selectedIDs, documentId, close, open }) => {
  const buttonsLeft = [
    {
      label: 'reload',
      onClick: appActionCreators.reloadDocumentList,
      disabled: false,
    },
    {
      label: 'import',
      onClick: appActionCreators.toggleShowImportDocuments,
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

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store';
import { ac } from '::root/store/actions.types';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SelectFile: React.FC<{
  reloadFiles;
  showDialog;
  isOnMobile;
} & PropsFromRedux> = ({ documentId, reloadFiles, showDialog, isOnMobile }) => {
  const [selectedIDs, setSelectedIDs] = useState([]);
  const close = appActionCreators.toggleFileSelect;
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

  const { loading, documentsList } = useGetDocumentsList({ reloadFiles });

  const { deleteDocument } = useDeleteFile({
    IDs: selectedIDs,
    onCompleted: () => {
      appActionCreators.reloadDocumentList();
      if (selectedIDs.includes(documentId)) {
        ac.document.setDocumentId(undefined);
      }
    },
  });
  const holdingRef = useRef(false);
  const rightHeaderButtons = [
    documentsList.length && holdingRef.current && (
      <CircleButton
        key={Icons.material.clear}
        className={modDialog.dialog__header__fileButton}
        onClick={() => {
          setSelectedIDs([selectedIDs.pop()]);
          holdingRef.current = false;
        }}
      >
        <Icon name={Icons.material.cancel} />
      </CircleButton>
    ),
    documentsList.length && holdingRef.current && (
      <CircleButton
        disabled={!selectedIDs.length}
        key={Icons.material.delete}
        className={modDialog.dialog__header__fileButton}
        onClick={deleteDocument}
      >
        <Icon name={Icons.material['delete']} />
      </CircleButton>
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
      show={showDialog}
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
