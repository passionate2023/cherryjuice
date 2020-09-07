import * as React from 'react';
import { DocumentSubscription } from '::types/graphql/generated';
import { modDocumentOperations } from '::sass-modules';
import { Document } from './components/document/document';

type Props = {
  imports: DocumentSubscription[];
  exports: DocumentSubscription[];
};

const Body: React.FC<Props> = ({ imports, exports }) => {
  return (
    <div
      className={modDocumentOperations.documentOperations__documentsContainer}
    >
      {imports.map(document => (
        <Document key={document.id} document={document} />
      ))}
      {exports.map(document => (
        <Document key={document.id} document={document} />
      ))}
    </div>
  );
};

export { Body };
