import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from '::store/ducks/helpers/shared';
import { rootActionCreators as rac } from '::store/ducks/root';
import { nodeActionCreators as nac } from '::store/ducks/node';
import { documentActionCreators as dac } from '::store/ducks/document';
import { cloneObj } from '@cherryjuice/shared-helpers';
import { SortDirection } from '@cherryjuice/graphql-types';
import {
  setSortBy,
  SetSortByPayload,
} from '::store/ducks/home/reducers/set-sort-by';

export enum SortDocumentsBy {
  CreatedAt = 'CreatedAt',
  DocumentName = 'DocumentName',
  Size = 'Size',
  UpdatedAt = 'UpdatedAt',
}

const ap = createActionPrefixer('home');

const ac = {
  selectFolder: _(ap('select-folder'), _ => (folder: string) => _({ folder })),
  setSortBy: _(ap('set-sort-by'), _ => (sortBy: SetSortByPayload) => _(sortBy)),
  selectDocument: _(ap('select-document'), _ => (documentId: string) =>
    _({ documentId }),
  ),
  setQuery: _(ap('set-query'), _ => (query: string) => _(query)),
  clearQuery: _(ap('clear-query')),
  show: _(ap('show')),
  hide: _(ap('hide')),
};

type State = {
  folder: string;
  activeDocumentId: string;
  sortBy: SortDocumentsBy;
  sortDirection: SortDirection;
  query: string;
  show: boolean;
};

const initialState: State = {
  folder: 'drafts',
  activeDocumentId: undefined,
  sortBy: SortDocumentsBy.DocumentName,
  sortDirection: SortDirection.Ascending,
  query: '',
  show: false,
};
const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(ac.selectFolder, (state, { payload }) => ({
    ...state,
    folder: payload.folder.toLowerCase(),
    show: !!payload.folder,
  })),
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
