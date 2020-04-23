import * as React from 'react';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { DocumentMeta } from '::types/generated';
import { modSelectFile } from '::sass-modules/index';
import { DocumentGroup } from './document-group';
import { SpinnerCircle } from '::shared-components/spinner-circle';

const DocumentList = ({
  selected,
  setSelected,
  selectedFile,
  data,
  loading,
}) => {
  let filesPerFolders: [string, DocumentMeta[]][];
  if (data) {
    filesPerFolders = [
      QUERY_DOCUMENTS.path(data).reduce((acc, val) => {
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
          <DocumentGroup
            key={folder}
            selected={selected}
            selectedFile={selectedFile}
            setSelected={setSelected}
           folder={'Default group'}
            files={files}
          />
        ))
      )}
    </div>
  );
};

export { DocumentList };
