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

const SelectFile = ({ selectedFile, reloadFiles, showDialog, isOnMobile }) => {
  const [selected, setSelected] = useState({ id: '', path: '' });
  const history = useHistory();
  const close = appActionCreators.toggleFileSelect;
  const open = () => {
    history.push('/');
    appActionCreators.selectFile(selected.id);
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
      disabled: selected.id === selectedFile || !selected.id,
    },
  ];

  const { deleteDocument, deleteLoading } = useDeleteFile(
    [selected.id],
    manualFetch,
  );
  const rightHeaderButtons = [
    (deleteLoading || selected.id) && (
      <CircleButton
        key={Icons.material.delete}
        className={modDialog.dialog__header__fileButton}
        onClick={deleteDocument}
      >
        <Icon name={Icons.material.delete} small={true} />
      </CircleButton>
    ),
  ];

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
          setSelected={setSelected}
          selectedFile={selectedFile}
          selected={selected}
          data={data}
          loading={loading}
        />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default SelectFile;
