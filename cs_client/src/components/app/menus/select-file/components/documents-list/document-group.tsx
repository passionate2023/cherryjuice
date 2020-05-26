import * as React from 'react';
import { modSelectFile } from '::sass-modules/index';
import { DocumentMeta } from '::types/generated';
import { Document } from './document';

const DocumentGroup = ({
  folder,
  files,
  selectedIDs,
                         documentId,
  onSelect,
}) => {
  return (
    <div className={modSelectFile.selectFile__fileFolder}>
      <span className={modSelectFile.selectFile__fileFolder__name}>
        {folder}
      </span>
      <span className={modSelectFile.selectFile__fileFolder__files}>
        {files.map((fileProps: DocumentMeta) => (
          <Document
            {...fileProps}
            key={fileProps.id}
            onSelect={onSelect}
            selectedIDs={selectedIDs}
            documentId={documentId}
          />
        ))}
      </span>
    </div>
  );
};

export { DocumentGroup };
