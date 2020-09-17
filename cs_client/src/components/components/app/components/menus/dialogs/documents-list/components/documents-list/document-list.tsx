import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { DocumentGroup } from './components/document-group';
import { SpinnerCircle } from '::root/components/shared-components/loading-indicator/spinner-circle';
import { CachedDocument } from '::store/ducks/cache/document-cache';
import { useMemo } from 'react';

type DocumentsListProps = {
  documents: CachedDocument[];
  loading: boolean;
};
const DocumentList = ({ documents, loading }: DocumentsListProps) => {
  const filesPerFolders: [string, CachedDocument[]][] = useMemo(() => {
    const categoriesDict = documents
      .sort((a, b) => a.updatedAt - b.updatedAt)
      .reverse()
      .reduce((acc, val) => {
        const folder = val.folder || 'Default group';
        if (acc[folder]) {
          acc[folder].push(val);
        } else acc[folder] = [val];

        return acc;
      }, {});

    return Object.entries(categoriesDict);
  }, [documents]);
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
