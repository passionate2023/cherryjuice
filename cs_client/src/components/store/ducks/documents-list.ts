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
import { QDocumentsListItem } from '::graphql/queries/documents-list';

const ap = createActionPrefixer('document-list');

const ac = {
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
    selectAllDocuments: _(ap('select-all-documents')),
  },
};

type State = {
  focusedDocumentId?: string;
  fetchDocuments: AsyncOperation;
  deleteDocuments: AsyncOperation;
  documents: QDocumentsListItem[];
  selectedIDs: string[];
  deletionMode: boolean;
};

const initialState: State = {
  fetchDocuments: 'idle',
  deleteDocuments: 'idle',
  documents: [],
  selectedIDs: [],
  deletionMode: false,
};
const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  ...[
    _(ac.fetchDocumentsFulfilled, (state, { payload }) => ({
      ...state,
      documents: editedDocuments(addUnsavedDocuments(payload)),
      fetchDocuments: 'idle',
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
    _(ac.selectAllDocuments, state => ({
      ...state,
      selectedIDs:
        state.selectedIDs.length === state.documents.length
          ? []
          : state.documents.map(document => document.id),
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
]);

export { reducer as documentsListReducer, ac as documentsListActionCreators };
