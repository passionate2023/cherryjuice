import modSelectFIle from '::sass-modules/select-file/select-file.scss';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSync } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { appActions } from '../../reducer';
import { dateToFormattedString } from '::helpers/time';
import { QUERY_CT_FILES } from '::graphql/queries';
import { Ct_File } from '::types/generated';
import { Scrim } from '::shared-components/scrim';

type Props = { selectedFile: string; dispatch: any };

const SelectFile: React.FC<Props> = ({ selectedFile, dispatch }) => {
  const history = useHistory();
  const [selected, setSelected] = useState({ id: '', path: '' });

  const [fetch, { data }] = useLazyQuery(QUERY_CT_FILES, {
    fetchPolicy: 'network-only',
  });

  const firstFetch = useRef(false);
  if (!firstFetch.current) {
    firstFetch.current = true;
    fetch();
  }
  let files: Ct_File[];
  if (data) {
    files = data.ct_files;
  }

  const onSelect = useCallback(
    e => {
      let selectedId = e.target.parentElement.dataset.id;
      let selectedPath = e.target.parentElement.dataset.path;
      setSelected({ id: selectedId, path: selectedPath });
    },
    [selectedFile],
  );
  // @ts-ignore
  return (
    <>
      <Scrim />
      <div className={modSelectFIle.selectFile}>
        <div className={modSelectFIle.selectFile__table}>
          <table>
            <tbody>
              <tr>
                <th>name</th>
                <th>size</th>
                <th>modified</th>
              </tr>
              {data &&
                files.map(
                  ({ name, size, fileContentModification, id, filePath }) => (
                    <tr
                      className={`${modSelectFIle.selectFile__file} ${
                        selected.id === id
                          ? modSelectFIle.selectFile__fileSelected
                          : ''
                      }`}
                      data-id={id}
                      data-path={filePath}
                      onClick={onSelect}
                      key={id}
                    >
                      <td>
                        {name}{' '}
                        {id === selectedFile && (
                          <FontAwesomeIcon icon={faCheck} color={'green'} />
                        )}
                      </td>
                      <td>{size / 1024}kb</td>
                      <td>
                        {dateToFormattedString(
                          new Date(fileContentModification),
                        )}
                      </td>
                    </tr>
                  ),
                )}
            </tbody>
          </table>
        </div>
        <div className={modSelectFIle.selectFile__infoBar}>
          {selected.path && <p>path: {selected.path}</p>}
        </div>
        <div className={modSelectFIle.selectFile__buttons}>
          <button
            onClick={() => dispatch({ type: appActions.TOGGLE_FILE_SELECT })}
          >
            close
          </button>
          <button
            onClick={() => {
              history.push('/');
              return dispatch({
                type: appActions.SELECT_FILE,
                value: selected.id,
              });
            }}
            disabled={selected.id === selectedFile || !selected.id}
          >
            open
          </button>
          <button
            className={modSelectFIle.selectFile__buttons__refresh}
            //@ts-ignore
            onClick={fetch}
          >
            <FontAwesomeIcon icon={faSync} color={'dimgray'} />
          </button>
        </div>
      </div>
    </>
  );
};

export { SelectFile };
