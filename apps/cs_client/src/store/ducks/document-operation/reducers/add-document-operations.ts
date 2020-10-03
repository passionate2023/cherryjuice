import {
  DocumentOperation,
  OPERATION_STATE,
  OPERATION_TYPE,
} from '@cherryjuice/graphql-types';
import { DocumentOperationState } from '::store/ducks/document-operation/document-operations';

export const doKey = (operation: DocumentOperation): string =>
  operation.target.id + ':' + operation.type;

export const addDocumentOperations = (operations: DocumentOperation[]) => (
  state: DocumentOperationState,
): DocumentOperationState => {
  operations.forEach(operation => {
    if (
      operation.type === OPERATION_TYPE.DELETE &&
      operation.state === OPERATION_STATE.FINISHED
    ) {
      delete state.operations[doKey(operation)];
    } else {
      state.operations[doKey(operation)] = operation;
    }
  });
  return state;
};
