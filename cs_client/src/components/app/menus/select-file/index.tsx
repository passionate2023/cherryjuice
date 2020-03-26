import { modSelectFile } from '::sass-modules/index';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { appActions } from '../../reducer';
import { dateToFormattedString } from '::helpers/time';
import { QUERY_CT_FILES } from '::graphql/queries';
import { Ct_File } from '::types/generated';
import { Dialog } from '::shared-components/material/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';

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
        files.map(({ name, size, fileContentModification, id, filePath }) => (
          <span
            className={`${modSelectFile.selectFile__file} ${
              selected.id === id
                ? modSelectFile.selectFile__fileSelectedCandidate
                : ''
            } ${
              selectedFile === id ? modSelectFile.selectFile__fileSelected : ''
            }`}
            data-id={id}
            data-path={filePath}
            onClick={onSelect}
            key={id}
            tabIndex={0}
          >
            <span className={`${modSelectFile.selectFile__file__name} `}>
              {name}
            </span>

            <span className={`${modSelectFile.selectFile__file__details} `}>
              <span>{size / 1024}kb</span>
              <span>
                {dateToFormattedString(new Date(fileContentModification))}
              </span>
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

const Files = ({ selected, setSelected, selectedFile }) => {
  const [fetch, { data }] = useLazyQuery(QUERY_CT_FILES, {
    fetchPolicy: 'network-only',
  });

  const firstFetch = useRef(false);
  if (!firstFetch.current) {
    firstFetch.current = true;
    fetch();
  }
  // let files: Ct_File[];
  let filesPerFolders: [string, Ct_File[]][];
  if (data) {
    filesPerFolders = [
      data.ct_files.reduce((acc, val) => {
        if (acc[val.fileFolder]) acc[val.fileFolder].push(val);
        else acc[val.fileFolder] = [val];

        return acc;
      }, {}),
    ].map(Object.entries)[0];
  }

  return (
    <div className={modSelectFile.selectFile}>
      {filesPerFolders &&
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
        ))}
    </div>
  );
};

const SelectFile = ({ dispatch, selectedFile }) => {
  const [selected, setSelected] = useState({ id: '', path: '' });
  const history = useHistory();
  const close = useCallback(
    () => dispatch({ type: appActions.TOGGLE_FILE_SELECT }),
    [],
  );
  const open = () => {
    history.push('/');
    return dispatch({
      type: appActions.SELECT_FILE,
      value: selected.id,
    });
  };
  const buttons = [
    {
      label: 'cancel',
      onClick: close,
      disabled: false,
    },
    {
      label: 'open',
      onClick: open,
      disabled: selected.id === selectedFile || !selected.id,
    },
    {
      label: <FontAwesomeIcon icon={faSync} color={'dimgray'} />,
      onClick: fetch,
      disabled: false,
    },
  ];
  return (
    <Dialog
      dialogTitle={'Select Document'}
      onCloseDialog={close}
      dialogFooterButtons={buttons}
    >
      <ErrorBoundary dispatch={dispatch}>
        <Files
          setSelected={setSelected}
          selectedFile={selectedFile}
          selected={selected}
        />
      </ErrorBoundary>
    </Dialog>
  );
};
export { SelectFile };
