import { modSelectFile } from '::sass-modules/index';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { appActionCreators } from '../../reducer';
import { dateToFormattedString } from '::helpers/time';
import { QUERY_CT_FILES } from '::graphql/queries';
import { DocumentMeta } from '::types/generated';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { useReloadQuery } from '::hooks/use-reload-query';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { SpinnerCircle } from '::shared-components/spinner-circle';

const Lines: React.FC<{ data; files; selected; setSelected; selectedFile }> = ({
  data,
  files,
  selected,
  setSelected,
  selectedFile,
}) => {
  const onSelect = useCallback(
    e => {
      let selectedId = e.target.parentElement.dataset.id;
      let selectedPath = e.target.parentElement.dataset.path;
      setSelected({ id: selectedId, path: selectedPath });
    },
    [selectedFile],
  );
  return (
    <div>
      {data &&
        files.map(({ name, size, updatedAt, id, folder }: DocumentMeta) => (
          <span
            className={`${modSelectFile.selectFile__file} ${
              selected.id === id
                ? modSelectFile.selectFile__fileSelectedCandidate
                : ''
            } ${
              selectedFile === id ? modSelectFile.selectFile__fileSelected : ''
            }`}
            data-id={id}
            data-folder={folder}
            onClick={onSelect}
            key={id}
            tabIndex={0}
          >
            <span className={`${modSelectFile.selectFile__file__name} `}>
              {name}
            </span>

            <span className={`${modSelectFile.selectFile__file__details} `}>
              <span>{size / 1024}kb</span>
              <span>{dateToFormattedString(new Date(updatedAt))}</span>
            </span>
          </span>
        ))}
    </div>
  );
};
const Folder = ({
  folder,
  files,
  selected,
  selectedFile,
  setSelected,
  data,
}) => (
  <div className={modSelectFile.selectFile__fileFolder}>
    <span className={modSelectFile.selectFile__fileFolder__name}>{folder}</span>
    <span className={modSelectFile.selectFile__fileFolder__files}>
      <Lines
        selected={selected}
        selectedFile={selectedFile}
        data={data}
        files={files}
        setSelected={setSelected}
      />
    </span>
  </div>
);

const Files = ({ selected, setSelected, selectedFile, data, loading }) => {
  let filesPerFolders: [string, DocumentMeta[]][];
  if (data) {
    filesPerFolders = [
      data.document.reduce((acc, { document_meta: val }) => {
        if (acc[val.folder]) acc[val.folder].push(val);
        else acc[val.folder] = [val];

        return acc;
      }, {}),
    ].map(Object.entries)[0];
  }

  return (
    <div className={modSelectFile.selectFile}>
      {loading ? (
        <SpinnerCircle />
      ) : (
        filesPerFolders &&
        filesPerFolders.map(([folder, files]) => (
          <Folder
            key={folder}
            selected={selected}
            selectedFile={selectedFile}
            setSelected={setSelected}
            data={data}
            folder={folder}
            files={files}
          />
        ))
      )}
    </div>
  );
};

const SelectFile = ({ selectedFile, reloadFiles, showDialog, isOnMobile }) => {
  const [selected, setSelected] = useState({ id: '', path: '' });
  const history = useHistory();
  const close = appActionCreators.toggleFileSelect;
  const open = () => {
    history.push('/');
    appActionCreators.selectFile(selected.id);
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const { data, loading, error } = useReloadQuery(
    {
      reloadRequestID: reloadFiles,
    },
    {
      query: QUERY_CT_FILES,
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
  return (
    <DialogWithTransition
      dialogTitle={'Select Document'}
      dialogFooterRightButtons={buttonsRight}
      dialogFooterLeftButtons={buttonsLeft}
      isOnMobile={isOnMobile}
      show={showDialog}
      onClose={close}
    >
      <ErrorBoundary>
        <Files
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
