import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  DocumentSubscription,
  DOCUMENT_SUBSCRIPTIONS as DS,
} from '::types/graphql/generated';

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

type State = {
  imports: { [id: string]: DocumentSubscription };
  exports: { [id: string]: DocumentSubscription };
};

const initialState: State = {
  imports: {},
  exports: {},
};
const reducer = createReducer(initialState, _ => [
  _(ac.addExports, (state, { payload }) => ({
    ...state,
    exports: {
      ...state.exports,
      ...Object.fromEntries(payload.map(document => [document.id, document])),
    },
  })),
  _(ac.addImports, (state, { payload }) => ({
    ...state,
    imports: {
      ...state.imports,
      ...Object.fromEntries(payload.map(document => [document.id, document])),
    },
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
    exports: Object.fromEntries(
      Object.entries(state.exports).filter(
        ([, { status }]) => ![DS.EXPORT_FINISHED].includes(status),
      ),
    ),
    imports: Object.fromEntries(
      Object.entries(state.imports).filter(
        ([, { status }]) => ![DS.IMPORT_FINISHED].includes(status),
      ),
    ),
  })),
]);

export {
  reducer as documentOperationsReducer,
  ac as documentOperationsActionCreators,
};
