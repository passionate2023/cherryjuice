import * as React from 'react';
import { DocumentMeta } from '::types/graphql-adapters';
import { modSelectFile } from '::sass-modules';
import { DocumentGroup } from './components/document-group';
import { SpinnerCircle } from '::root/components/shared-components/loading-indicator/spinner-circle';

const DocumentList = ({
  // selectedIDs,
  // onSelect,
  documentsMeta,
  loading,
  // deleteMode,
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
            // deleteMode={deleteMode}
            key={folder}
            // selectedIDs={selectedIDs}
            // onSelect={onSelect}
            folder={folder}
            files={files}
          />
        ))
      )}
    </div>
  );
};

export { DocumentList };
