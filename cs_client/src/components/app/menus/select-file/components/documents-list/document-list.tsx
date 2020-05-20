import * as React from 'react';
import { DocumentMeta } from '::types/generated';
import { modSelectFile } from '::sass-modules/index';
import { DocumentGroup } from './document-group';
import { SpinnerCircle } from '::shared-components/spinner-circle';

const DocumentList = ({
  selectedIDs,
  onSelect,
  selectedFile,
  documentsMeta,
  loading,
}) => {
  const filesPerFolders: [string, DocumentMeta[]][] = [
    documentsMeta.reduce((acc, val) => {
      if (!val.folder) val.folder = 'Default group';
      if (acc[val.folder]) acc[val.folder].push(val);
      else acc[val.folder] = [val];

      return acc;
    }, {}),
  ].map(Object.entries)[0];

  return (
    <div className={modSelectFile.selectFile}>
      {loading ? (
        <SpinnerCircle />
      ) : (
        filesPerFolders.map(([folder, files]) => (
          <DocumentGroup
            key={folder}
            selectedIDs={selectedIDs}
            selectedFile={selectedFile}
            onSelect={onSelect}
            folder={folder}
            files={files}
          />
        ))
      )}
    </div>
  );
};

export { DocumentList };
