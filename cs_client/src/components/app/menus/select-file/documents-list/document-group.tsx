import * as React from 'react';
import { useCallback } from 'react';
import { modSelectFile } from '::sass-modules/index';
import { DocumentMeta } from '::types/generated';
import { Document } from './document';

const DocumentGroup = ({
  folder,
  files,
  selected,
  selectedFile,
  setSelected,
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
            selected={selected}
            selectedFile={selectedFile}
            folder={'Default group'}
          />
        ))}
      </span>
    </div>
  );
};

export { DocumentGroup };
