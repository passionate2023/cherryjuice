import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { AsyncOperation } from './document';
import { rootActionCreators as rac } from '::store/ducks/root';
import { homeActionCreators as hac } from '::store/ducks/home/home';
import { cloneObj } from '@cherryjuice/shared-helpers';
import { CachedDocument } from '::store/ducks/document-cache/document-cache';
import { LoadDocumentsListPayload } from '::store/ducks/document-cache/helpers/document/load-documents-list';
import {
  SearchSortOptions,
  SortDirection,
  SortNodesBy,
} from '@cherryjuice/graphql-types';

const ap = createActionPrefixer('document-list');

const ac = {
  ...{
    fetchDocuments: _(ap('fetch-documents')),
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
  ...{
    toggleFilters: _(ap('toggle-filters')),
    setSortBy: _(ap('set-sort-by'), _ => (options: SortNodesBy) => _(options)),
    toggleSortDirection: _(ap('toggle-sort-direction')),
  },
};

type State = {
  focusedDocumentId?: string;
  query?: string;
  asyncOperations: {
    fetchDocuments: AsyncOperation;
  };
  deleteDocuments: AsyncOperation;
  selectedIDs: string[];
  deletionMode: boolean;
  sortOptions: SearchSortOptions;
  showFilters: boolean;
};

const initialState: State = {
  asyncOperations: {
    fetchDocuments: 'idle',
  },
  deleteDocuments: 'idle',
  selectedIDs: [],
  deletionMode: false,
  query: '',
  sortOptions: {
    sortBy: SortNodesBy.DocumentName,
    sortDirection: SortDirection.Ascending,
  },
  showFilters: false,
};
const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
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
    _(hac.selectDocument, (state, { payload: { documentId } }) => ({
      ...state,
      focusedDocumentId: documentId,
      selectedIDs: [documentId],
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
  ...[
    _(ac.setSortBy, (state, { payload }) => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        sortBy: payload,
      },
    })),
    _(ac.toggleSortDirection, state => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        sortDirection:
          state.sortOptions.sortDirection === SortDirection.Descending
            ? SortDirection.Ascending
            : SortDirection.Descending,
      },
    })),
    _(ac.toggleFilters, state => ({
      ...state,
      showFilters: !state.showFilters,
    })),
  ],
  ...[
    _(ac.fetchDocuments, state => ({
      ...state,
      asyncOperations: {
        ...state.asyncOperations,
        fetchDocuments: 'pending',
      },
    })),
    _(ac.fetchDocumentsInProgress, state => ({
      ...state,
      asyncOperations: {
        ...state.asyncOperations,
        fetchDocuments: 'in-progress',
      },
    })),
    _(ac.fetchDocumentsFulfilled, state => ({
      ...state,
      asyncOperations: {
        ...state.asyncOperations,
        fetchDocuments: 'idle',
      },
    })),
    _(ac.fetchDocumentsFailed, state => ({
      ...state,
      asyncOperations: {
        ...state.asyncOperations,
        fetchDocuments: 'idle',
      },
    })),
  ],
]);

export { reducer as documentsListReducer, ac as documentsListActionCreators };
