import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { appActionCreators } from '../../reducer';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { useReloadQuery } from '::hooks/use-reload-query';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { DocumentList } from './documents-list/document-list';
import { CircleButton } from '::shared-components/buttons/circle-button';
import { modDialog } from '::sass-modules/index';
import { Icons, Icon } from '::shared-components/icon';
import { useDeleteFile } from '::hooks/graphql/delete-file';
import { useRef } from 'react';

const createButtons = ({ selectedIDs, selectedFile, close, open }) => {
  const buttonsLeft = [
    {
      label: 'reload',
      onClick: appActionCreators.setReloadFiles,
      disabled: false,
    },
    {
      label: 'import',
      onClick: appActionCreators.toggleShowImportDocuments,
      disabled: false,
    },
  ];
  const buttonsRight = [
    {
      label: 'close',
      onClick: close,
      disabled: false,
    },
    {
      label: 'open',
      onClick: open,
      disabled: selectedIDs[0] === selectedFile || selectedIDs.length !== 1,
    },
  ];
  return { buttonsLeft, buttonsRight };
};

const useData = ({ reloadFiles }) => {
  const { data, loading, error, manualFetch } = useReloadQuery(
    {
      reloadRequestID: reloadFiles,
    },
    {
      query: QUERY_DOCUMENTS.documentMeta.query,
      queryVariables: undefined,
    },
  );
  useQueryTimeout(
    {
      queryData: data,
      queryError: error,
      queryVariables: reloadFiles,
    },
    { resourceName: 'files' },
  );
  return { data, loading, manualFetch };
};

const SelectFile = ({ selectedFile, reloadFiles, showDialog, isOnMobile }) => {
  const [selectedIDs, setSelectedIDs] = useState([]);
  const history = useHistory();
  const close = appActionCreators.toggleFileSelect;
  const open = () => {
    history.push('/');
    appActionCreators.selectFile(selectedIDs[0]);
  };
  const { buttonsLeft, buttonsRight } = createButtons({
    selectedIDs,
    selectedFile,
    close,
    open,
  });

  const { loading, data, manualFetch } = useData({ reloadFiles });
  const documentsMeta = QUERY_DOCUMENTS.documentMeta.path(data);
  const { deleteDocument } = useDeleteFile({
    IDs: selectedIDs,
    onCompleted: () => {
      manualFetch();
      if (selectedIDs.includes(selectedFile)) {
        history.push('/');
        appActionCreators.selectFile('');
      }
    },
  });
  const holdingRef = useRef(false);
  const rightHeaderButtons = [
    documentsMeta.length && holdingRef.current && (
      <CircleButton
        key={Icons.material.clear}
        className={modDialog.dialog__header__fileButton}
        onClick={() => {
          setSelectedIDs([selectedIDs.pop()]);
          holdingRef.current = false;
        }}
      >
        <Icon name={Icons.material.cancel} small={true} />
      </CircleButton>
    ),
    documentsMeta.length && holdingRef.current && (
      <CircleButton
        disabled={!selectedIDs.length}
        key={Icons.material.delete}
        className={modDialog.dialog__header__fileButton}
        onClick={deleteDocument}
      >
        <Icon name={Icons.material['delete']} small={true} />
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
          selectedFile={selectedFile}
          documentsMeta={documentsMeta}
          loading={loading}
        />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default SelectFile;
