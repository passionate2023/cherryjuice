import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { DocumentOperation as TDocumentOperation } from '::types/graphql/generated';
import { ac } from '::store/store';
import { mapEventType } from './helpers/map-event-type';
import { ActionButton } from './components/action-button';

type Props = {
  operation: TDocumentOperation;
};
const DocumentOperation: React.FC<Props> = ({ operation }) => {
  const open = () => {
    ac.document.setDocumentId(operation.target.id);
  };

  return (
    <div className={modDocumentOperations.documentOperations__document}>
      <div className={modDocumentOperations.documentOperations__document__name}>
        {operation.target.name}
      </div>
      <div
        className={modDocumentOperations.documentOperations__document__status}
      >
        {mapEventType(operation)}
      </div>
      <ActionButton open={open} operation={operation} />
    </div>
  );
};

export { DocumentOperation };
