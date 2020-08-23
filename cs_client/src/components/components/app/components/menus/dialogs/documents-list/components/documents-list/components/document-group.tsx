import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { Document } from './document/document';
import { CachedDocument } from '::store/ducks/cache/document-cache';

type DocumentGroupProps = {
  documents: CachedDocument[];
  folder: string;
};
const DocumentGroup = ({ folder, documents }: DocumentGroupProps) => {
  return (
    <div className={modSelectFile.selectFile__fileFolder}>
      <span className={modSelectFile.selectFile__fileFolder__name}>
        {folder}
      </span>
      <span className={modSelectFile.selectFile__fileFolder__files}>
        {documents.map(document => (
          <Document document={document} key={document.id} />
        ))}
      </span>
    </div>
  );
};

export { DocumentGroup };
