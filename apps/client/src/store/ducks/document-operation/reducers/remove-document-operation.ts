import { DocumentOperation } from '@cherryjuice/graphql-types';
import { DocumentOperationState } from '::store/ducks/document-operation/document-operations';
import { doKey } from '::store/ducks/document-operation/reducers/add-document-operations';

export const removeDocumentOperation = (operation: DocumentOperation) => (
  state: DocumentOperationState,
): DocumentOperationState => {
  delete state.operations[doKey(operation)];
  return state;
};
