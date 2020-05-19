import * as React from 'react';
import { modSelectFile } from '::sass-modules/index';
import { DocumentMeta } from '::types/generated';
import { Document } from './document';

const DocumentGroup = ({
  folder,
  files,
  selectedIDs,
  selectedFile,
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
            selectedFile={selectedFile}
          />
        ))}
      </span>
    </div>
  );
};

export { DocumentGroup };
