import React from 'react';
import { OperationTypes } from './helpers/operation-types';
import { DocumentOperation, OPERATION_TYPE } from '@cherryjuice/graphql-types';
import { Active } from '::app/components/menus/widgets/components/document-operations/components/components/active';
import { Failed } from '::app/components/menus/widgets/components/document-operations/components/components/failed';
import { Blocked } from '::app/components/menus/widgets/components/document-operations/components/components/blocked';
import { SuccessfullyCreated } from '::app/components/menus/widgets/components/document-operations/components/components/successfully-created';
import { SuccessfullyExported } from '::app/components/menus/widgets/components/document-operations/components/components/successfully-exported';

type Props = {
  operation: DocumentOperation;
};
const ActionButton: React.FC<Props> = ({ operation }) => {
  const { state } = operation;
  if (OperationTypes.active[state]) {
    return <Active operation={operation} />;
  } else if (OperationTypes.failed[state]) {
    return <Failed operation={operation} />;
  } else if (
    OperationTypes.successful[state] &&
    (operation.type === OPERATION_TYPE.IMPORT ||
      operation.type === OPERATION_TYPE.CLONE)
  ) {
    return <SuccessfullyCreated operation={operation} />;
  } else if (
    OperationTypes.successful[state] &&
    operation.type === OPERATION_TYPE.EXPORT
  ) {
    return <SuccessfullyExported operation={operation} />;
  } else if (OperationTypes.blocked[state]) {
    return <Blocked />;
  } else return <></>;
};

export { ActionButton };
