import * as React from 'react';
import { modSelectFile } from '::sass-modules/index';
import { DocumentMeta } from '::types/graphql/adapters';
import { Document } from './components/document';

const DocumentGroup = ({
  folder,
  files,
  selectedIDs,
  documentId,
  onSelect,
  deleteMode,
}) => {
  return (
    <div className={modSelectFile.selectFile__fileFolder}>
      <span className={modSelectFile.selectFile__fileFolder__name}>
        {folder}
      </span>
      <span className={modSelectFile.selectFile__fileFolder__files}>
        {files.map((fileProps: DocumentMeta) => (
          <Document
            documentMeta={fileProps}
            key={fileProps.id}
            onSelect={onSelect}
            selectedIDs={selectedIDs}
            documentId={documentId}
            deleteMode={deleteMode}
          />
        ))}
      </span>
    </div>
  );
};

export { DocumentGroup };
