import * as React from 'react';
import { Document } from './document/document';
import { CachedDocument } from '::store/ducks/document-cache/document-cache';
import { DialogCard } from '::root/components/shared-components/dialog/dialog-list/dialog-card';
import { memo } from 'react';

type DocumentGroupProps = {
  documents: CachedDocument[];
  folder: string;
};
const DocumentGroup = ({ folder, documents }: DocumentGroupProps) => {
  return (
    <DialogCard
      name={folder}
      items={documents.map(document => (
        <Document document={document} key={document.id} />
      ))}
    />
  );
};
const M = memo(DocumentGroup);
export { M as DocumentGroup };
