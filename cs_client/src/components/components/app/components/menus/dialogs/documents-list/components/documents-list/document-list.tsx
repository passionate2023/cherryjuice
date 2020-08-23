import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { DocumentGroup } from './components/document-group';
import { SpinnerCircle } from '::root/components/shared-components/loading-indicator/spinner-circle';
import { CachedDocument } from '::store/ducks/cache/document-cache';

type DocumentsListProps = {
  documents: CachedDocument[];
  loading: boolean;
};
const DocumentList = ({ documents, loading }: DocumentsListProps) => {
  const filesPerFolders: [string, CachedDocument[]][] = [
    documents.reduce((acc, val) => {
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
        filesPerFolders.map(([folder, documents]) => (
          <DocumentGroup key={folder} folder={folder} documents={documents} />
        ))
      )}
    </div>
  );
};

export { DocumentList };
