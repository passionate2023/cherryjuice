import { OPERATION_STATE } from '::types/graphql/generated';
import { DocumentOperationState } from '::store/ducks/document-operation/document-operations';
import { doKey } from '::store/ducks/document-operation/reducers/add-document-operations';

export const removeStaleOperations = () => (
  state: DocumentOperationState,
): DocumentOperationState => {
  Object.values(state.operations).forEach(operation => {
    if (
      operation.state === OPERATION_STATE.FINISHED ||
      operation.state === OPERATION_STATE.FAILED ||
      operation.state === OPERATION_STATE.DUPLICATE
    )
      delete state.operations[doKey(operation)];
  });

  return state;
};
