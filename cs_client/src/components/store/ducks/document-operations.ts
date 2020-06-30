import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { DocumentSubscription } from '::types/graphql/generated';
import { filterStaleOperations } from './helpers/document-operations';

const ap = createActionPrefixer('document-operation');

const ac = {
  addExports: _(ap('addExports'), _ => (documents: DocumentSubscription[]) =>
    _(documents),
  ),
  addImports: _(ap('addImports'), _ => (documents: DocumentSubscription[]) =>
    _(documents),
  ),
  deleteImport: _(ap('deleteImport'), _ => (id: string) => _(id)),
  deleteExport: _(ap('deleteExport'), _ => (id: string) => _(id)),
  clearFinished: _(ap('clearFinished')),
};

type DocumentSubscriptions = { [id: string]: DocumentSubscription };
type State = {
  imports: DocumentSubscriptions;
  exports: DocumentSubscriptions;
};

const initialState: State = {
  imports: {},
  exports: {},
};
const reducer = createReducer(initialState, _ => [
  _(ac.addExports, (state, { payload }) => ({
    ...state,
    exports: filterStaleOperations.deleted({
      ...state.exports,
      ...Object.fromEntries(payload.map(document => [document.id, document])),
    }),
  })),
  _(ac.addImports, (state, { payload }) => ({
    ...state,
    imports: filterStaleOperations.deleted({
      ...state.imports,
      ...Object.fromEntries(payload.map(document => [document.id, document])),
    }),
  })),
  _(ac.deleteImport, (state, { payload }) => ({
    ...state,
    imports: Object.fromEntries(
      Object.entries(state.imports).filter(([id]) => id !== payload),
    ),
  })),
  _(ac.deleteExport, (state, { payload }) => ({
    ...state,
    exports: Object.fromEntries(
      Object.entries(state.exports).filter(([id]) => id !== payload),
    ),
  })),
  _(ac.clearFinished, state => ({
    exports: filterStaleOperations.finished(state.imports),
    imports: filterStaleOperations.finished(state.imports),
  })),
]);

export {
  reducer as documentOperationsReducer,
  ac as documentOperationsActionCreators,
};
export { DocumentSubscriptions };
