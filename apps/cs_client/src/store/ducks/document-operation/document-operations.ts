import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from '../helpers/shared';
import { rootActionCreators as rac } from '../root';
import { cloneObj } from '@cherryjuice/shared-helpers';
import produce from 'immer';
import { DocumentOperation } from '@cherryjuice/graphql-types';
import { addDocumentOperations } from '::store/ducks/document-operation/reducers/add-document-operations';
import { removeStaleOperations } from '::store/ducks/document-operation/reducers/remove-stale-operations';
import { removeDocumentOperation } from '::store/ducks/document-operation/reducers/remove-document-operation';

const ap = createActionPrefixer('document-operation');

const ac = {
  add: _(ap('add'), _ => (...operations: DocumentOperation[]) => _(operations)),
  remove: _(ap('remove'), _ => (operation: DocumentOperation) => _(operation)),
  removeFinished: _(ap('remove-finished')),
};

type State = {
  operations: {
    [documentId_type: string]: DocumentOperation;
  };
};

const initialState: State = { operations: {} };
const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(ac.add, (state, { payload }) =>
    produce(state, addDocumentOperations(payload)),
  ),
  _(ac.remove, (state, { payload }) =>
    produce(state, removeDocumentOperation(payload)),
  ),
  _(ac.removeFinished, state => produce(state, removeStaleOperations())),
]);

export {
  reducer as documentOperationsReducer,
  ac as documentOperationsActionCreators,
  State as DocumentOperationState,
};
