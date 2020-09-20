import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { AsyncOperation } from './document';
import { rootActionCreators } from './root';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { CachedDocument } from '::store/ducks/cache/document-cache';
import { LoadDocumentsListPayload } from '::store/ducks/cache/document-cache/helpers/document/load-documents-list';

const ap = createActionPrefixer('document-list');

const ac = {
  ...{
    fetchDocuments: _(ap('fetch-documents')),
    fetchDocumentsPending: _(ap('fetch-documents-pending')),
    fetchDocumentsInProgress: _(ap('fetch-documents-in-progress')),
    fetchDocumentsFulfilled: _(
      ap('fetch-documents-fulfilled'),
      _ => (documents: LoadDocumentsListPayload) => _(documents),
    ),
    fetchDocumentsFailed: _(ap('fetch-documents-failed')),
  },
  ...{
    deleteDocuments: _(ap('delete-documents')),
    deleteDocument: _(ap('delete-document'), _ => (documentId: string) =>
      _(documentId),
    ),
    deleteDocumentsInProgress: _(ap('delete-documents-in-progress')),
    deleteDocumentsFulfilled: _(ap('delete-documents-fulfilled')),
    deleteDocumentsFailed: _(ap('delete-documents-failed')),
  },
  ...{
    enableDeletionMode: _(ap('enable-deletion-mode')),
    disableDeletionMode: _(ap('disable-deletion-mode')),
  },
  ...{
    selectDocument: _(ap('select-document'), _ => (id: string) => _(id)),
    selectAllDocuments: _(
      ap('select-all-documents'),
      _ => (documents: CachedDocument[]) => _(documents),
    ),
  },

  ...{
    setQuery: _(ap('set-query'), _ => (query: string) => _(query)),
    clearQuery: _(ap('clear-query')),
  },
};

type State = {
  focusedDocumentId?: string;
  query?: string;
  fetchDocuments: AsyncOperation;
  deleteDocuments: AsyncOperation;
  selectedIDs: string[];
  deletionMode: boolean;
};

const initialState: State = {
  fetchDocuments: 'idle',
  deleteDocuments: 'idle',
  selectedIDs: [],
  deletionMode: false,
  query: '',
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  ...[
    _(ac.deleteDocuments, state => ({
      ...state,
      deleteDocuments: 'pending',
    })),
    _(ac.deleteDocument, state => ({
      ...state,
      deleteDocuments: 'pending',
    })),
    _(ac.deleteDocumentsInProgress, state => ({
      ...state,
      deleteDocuments: 'in-progress',
    })),
    _(ac.deleteDocumentsFulfilled, state => ({
      ...state,
      deleteDocuments: 'idle',
      deletionMode: false,
      selectedIDs: [],
    })),
    _(ac.deleteDocumentsFailed, state => ({
      ...state,
      deleteDocuments: 'idle',
    })),
  ],

  ...[
    _(ac.enableDeletionMode, state => ({
      ...state,
      deletionMode: true,
      selectedIDs: [],
    })),
    _(ac.disableDeletionMode, state => ({
      ...state,
      deletionMode: false,
      focusedDocumentId: undefined,
      selectedIDs: [],
    })),
  ],
  ...[
    _(ac.selectAllDocuments, (state, { payload }) => ({
      ...state,
      selectedIDs:
        state.selectedIDs.length === payload.length
          ? []
          : payload.map(document => document.id),
    })),
    _(ac.selectDocument, (state, { payload }) => ({
      ...state,
      focusedDocumentId: payload,
      selectedIDs: !state.deletionMode
        ? [payload]
        : state.selectedIDs.includes(payload)
        ? state.selectedIDs.filter(id => id !== payload)
        : [...state.selectedIDs, payload],
    })),
  ],
  ...[
    _(ac.setQuery, (state, { payload }) => ({
      ...state,
      query: payload,
    })),
    _(ac.clearQuery, state => ({
      ...state,
      query: '',
    })),
  ],
]);

export { reducer as documentsListReducer, ac as documentsListActionCreators };
