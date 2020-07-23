import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { AsyncOperation } from './document';
import { DocumentMeta } from '::types/graphql-adapters';
import {
  addUnsavedDocuments,
  editedDocuments,
} from '../epics/fetch-documents-list/layers/unsaved-documents';
import { rootActionCreators } from '::root/store/ducks/root';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { QDocumentMeta } from '::graphql/queries/query-document';

const ap = createActionPrefixer('document-list');

const ac = {
  ...{
    setFocusedDocumentId: _(
      ap('setFocusedDocumentId'),
      _ => (documentId: string) => _(documentId),
    ),
  },
  ...{
    fetchDocuments: _(ap('fetchDocuments')),
    fetchDocumentsPending: _(ap('fetchDocumentsPending')),
    fetchDocumentsInProgress: _(ap('fetchDocumentsInProgress')),
    fetchDocumentsFulfilled: _(
      ap('fetchDocumentsFulfilled'),
      _ => (documents: DocumentMeta[]) => _(documents),
    ),
    fetchDocumentsFailed: _(ap('fetchDocumentsFailed')),
  },
};

type State = {
  focusedDocumentId?: string;
  fetchDocuments: AsyncOperation;
  documents: QDocumentMeta[];
};

const initialState: State = {
  fetchDocuments: 'idle',
  documents: [],
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  ...[
    _(ac.setFocusedDocumentId, (state, { payload }) => ({
      ...state,
      focusedDocumentId: payload,
    })),
  ],
  ...[
    _(ac.fetchDocumentsFulfilled, (state, { payload }) => ({
      ...state,
      documents: editedDocuments(addUnsavedDocuments(payload)),
      fetchDocuments: 'idle',
    })),
  ],
]);

export { reducer as documentsListReducer, ac as documentsListActionCreators };
