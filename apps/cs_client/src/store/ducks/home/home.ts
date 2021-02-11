import { createActionCreator as cac, createReducer } from 'deox';
import { createActionPrefixer } from '::store/ducks/helpers/shared';
import { rootActionCreators as rac } from '::store/ducks/root';
import { nodeActionCreators as nac } from '::store/ducks/node';
import {
  AsyncOperation,
  documentActionCreators as dac,
} from '::store/ducks/document';
import { cloneObj } from '@cherryjuice/shared-helpers';
import { Folder, SortDirection } from '@cherryjuice/graphql-types';
import {
  setSortBy,
  SetSortByPayload,
} from '::store/ducks/home/reducers/set-sort-by';
import produce from 'immer';
import {
  removeFolder,
  RemoveFolderPayload,
} from '::store/ducks/home/reducers/remove-folder';
import { create_ } from '::store/boilerplate';
import {
  setFolderName,
  SetFolderNamePayload,
} from '::store/ducks/home/reducers/set-folder-name';
import {
  selectFolder,
  SelectFolderPayload,
} from '::store/ducks/home/reducers/select-folder';
import {
  createFolder,
  CreateFolderPayload,
} from '::store/ducks/home/reducers/create-folder';

export enum SortDocumentsBy {
  CreatedAt = 'CreatedAt',
  DocumentName = 'DocumentName',
  Size = 'Size',
  UpdatedAt = 'UpdatedAt',
}

const ap = createActionPrefixer('home');

const { noPayload: __, withPayload: _ } = create_('home');

const ac = {
  selectFolder: _<SelectFolderPayload>('select-folder'),
  setSortBy: cac(ap('set-sort-by'), _ => (sortBy: SetSortByPayload) =>
    _(sortBy),
  ),
  selectDocument: cac(ap('select-document'), _ => (documentId: string) =>
    _({ documentId }),
  ),
  setQuery: cac(ap('set-query'), _ => (query: string) => _(query)),
  clearQuery: cac(ap('clear-query')),
  show: cac(ap('show')),
  hide: cac(ap('hide')),
  toggleSidebar: __('toggle-sidebar'),
  createFolder: _<CreateFolderPayload>('create-folder'),
  removeFolder: _<RemoveFolderPayload>('remove-folder'),
  setFolderName: _<SetFolderNamePayload>('set-folder-name'),
  ...{
    fetchFolders: __('fetch-folders'),
    fetchFoldersInProgress: __('fetch-folders-in-progress'),
    fetchFoldersFailed: __('fetch-folders-failed'),
    fetchFoldersFulfilled: _<Folder[]>('fetch-folders-fulfilled'),
  },
};

export type CurrentFolder = { name: string; id: string };
export type FoldersDict = { [id: string]: Folder };
type State = {
  folder: CurrentFolder;
  draftsFolderId: string;
  activeDocumentId: string;
  sortBy: SortDocumentsBy;
  sortDirection: SortDirection;
  query: string;
  show: boolean;
  folders: FoldersDict;
  changes: {
    folders: {
      created: string[];
      edited: Record<string, string[]>;
      deleted: string[];
    };
  };
  showSidebar: boolean;
  asyncOperations: {
    fetchFolders: AsyncOperation;
  };
};

const changes = {
  folders: {
    created: [],
    edited: {},
    deleted: [],
  },
};
const initialState: State = {
  folder: {
    name: undefined,
    id: undefined,
  },
  draftsFolderId: undefined,
  activeDocumentId: undefined,
  sortBy: SortDocumentsBy.DocumentName,
  sortDirection: SortDirection.Ascending,
  query: '',
  show: false,
  showSidebar: false,
  folders: {},
  asyncOperations: {
    fetchFolders: 'idle',
  },
  changes: cloneObj(changes),
};
const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(ac.selectFolder, (state, { payload }) =>
    produce(state, selectFolder(payload)),
  ),
  _(ac.selectDocument, (state, { payload }) => ({
    ...state,
    activeDocumentId: payload.documentId,
  })),
  _(ac.setSortBy, (state, { payload }) => setSortBy(state, payload)),
  _(ac.setQuery, (state, { payload }) => ({
    ...state,
    query: payload,
  })),
  _(ac.clearQuery, state => ({
    ...state,
    query: '',
  })),
  _(ac.show, state => ({
    ...state,
    show: true,
  })),
  _(ac.hide, state => ({
    ...state,
    show: false,
  })),
  _(ac.setFolderName, (state, { payload }) =>
    produce(state, setFolderName(payload)),
  ),
  _(ac.removeFolder, (state, { payload }) =>
    produce(state, removeFolder(payload)),
  ),
  _(ac.createFolder, (state, { payload }) =>
    produce(state, createFolder(payload)),
  ),
  _(ac.toggleSidebar, state => ({
    ...state,
    showSidebar: !state.showSidebar,
  })),

  // fetch
  _(ac.fetchFoldersInProgress, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetchFolders: 'in-progress',
    },
  })),
  _(ac.fetchFoldersFailed, state => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetchFolders: 'idle',
    },
  })),
  _(ac.fetchFoldersFulfilled, (state, { payload }) => {
    let draftsFolderId;
    const folders = {
      ...state.folders,
      ...Object.fromEntries(
        payload.reduce((acc, folder) => {
          if (folder.name === 'Drafts') draftsFolderId = folder.id;
          acc.push([folder.id, folder]);
          return acc;
        }, []),
      ),
    };
    return {
      ...state,
      folders,
      changes: cloneObj(changes),
      draftsFolderId,
      asyncOperations: {
        ...state.asyncOperations,
        fetchFolders: 'idle',
      },
      folder: Object.keys(state.folder).length
        ? state.folder
        : {
            name: folders[draftsFolderId].name.toLowerCase(),
            id: draftsFolderId,
          },
    };
  }),
  // side-effects
  _(nac.select, state => ({
    ...state,
    show: false,
  })),
  _(dac.setDocumentId, state => ({
    ...state,
    show: false,
  })),
]);

export { reducer as homeReducer, ac as homeActionCreators };
export { State as HomeReducerState };
