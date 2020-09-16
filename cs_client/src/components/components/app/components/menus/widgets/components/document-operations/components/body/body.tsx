import * as React from 'react';
import { DocumentOperation as TDocumentOperation } from '::types/graphql/generated';
import { modDocumentOperations } from '::sass-modules';
import { DocumentOperation } from './components/document/document';

type Props = {
  operations: TDocumentOperation[];
};

const Body: React.FC<Props> = ({ operations }) => {
  return (
    <div
      className={modDocumentOperations.documentOperations__documentsContainer}
    >
      {operations.map(operation => (
        <DocumentOperation
          key={operation.type + operation.target.id}
          operation={operation}
        />
      ))}
    </div>
  );
};

export { Body };
