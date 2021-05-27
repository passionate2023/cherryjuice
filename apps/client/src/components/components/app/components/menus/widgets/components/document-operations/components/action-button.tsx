import React from 'react';
import { OperationTypes } from './helpers/operation-types';
import { DocumentOperation, OPERATION_TYPE } from '@cherryjuice/graphql-types';
import { StopDocumentOperation } from '::app/components/menus/widgets/components/document-operations/components/components/stop-document-operation';
import { DeleteDocument } from '::app/components/menus/widgets/components/document-operations/components/components/delete-document';
import { ClearDocumentOperation } from '::app/components/menus/widgets/components/document-operations/components/components/clear-document-operation';
import { OpenDocument } from '::app/components/menus/widgets/components/document-operations/components/components/open-document';
import { DownloadDocument } from '::app/components/menus/widgets/components/document-operations/components/components/download-document';

type Props = {
  operation: DocumentOperation;
};
const ActionButton: React.FC<Props> = ({ operation }) => {
  const { state } = operation;
  if (OperationTypes.active[state]) {
    return <StopDocumentOperation operation={operation} />;
  } else if (OperationTypes.failed[state]) {
    return operation.type === OPERATION_TYPE.EXPORT ? (
      <ClearDocumentOperation />
    ) : (
      <DeleteDocument operation={operation} />
    );
  } else if (
    OperationTypes.successful[state] &&
    (operation.type === OPERATION_TYPE.IMPORT ||
      operation.type === OPERATION_TYPE.CLONE)
  ) {
    return <OpenDocument operation={operation} />;
  } else if (
    OperationTypes.successful[state] &&
    operation.type === OPERATION_TYPE.EXPORT
  ) {
    return <DownloadDocument operation={operation} />;
  } else if (OperationTypes.blocked[state]) {
    return <ClearDocumentOperation />;
  } else return <></>;
};

export { ActionButton };
