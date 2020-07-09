import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  NodeSearchResultEntity,
  SearchScope,
  SearchTarget,
} from '::types/graphql/generated';

const ap = createActionPrefixer('search');

const ac = {
  ...{
    setQuery: _(ap('set-query'), _ => (query: string) => _(query)),
    clearQuery: _(ap('clear-query')),
  },
  ...{
    setSearchIdle: _(ap('set-search-idle')),
    setSearchStandBy: _(ap('set-search-stand-by')),
    setSearchQueued: _(ap('set-search-queued')),
    setSearchInProgress: _(ap('set-search-in-progress')),
    setSearchFulfilled: _(
      ap('set-search-fulfilled'),
      _ => (searchResults: NodeSearchResultEntity[]) => _(searchResults),
    ),
  },
  ...{
    setSearchScope: _(ap('set-search-scope'), _ => (scope: SearchScope) =>
      _(scope),
    ),
  },
  ...{
    setSearchTarget: _(ap('set-search-target'), _ => (scope: SearchTarget) =>
      _(scope),
    ),
  },
};

type SearchState = 'idle' | 'queued' | 'in-progress' | 'stand-by';

type State = {
  query: string;
  searchState: SearchState;
  searchScope: SearchScope;
  searchTarget: SearchTarget[];
  searchResults: NodeSearchResultEntity[];
};

const initialState: State = {
  query: '',
  searchState: 'idle',
  searchScope: SearchScope.currentDocument,
  searchTarget: [SearchTarget.nodeContent],
  searchResults: [],
};
const reducer = createReducer(initialState, _ => [
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
    _(ac.setSearchIdle, state => ({
      ...state,
      searchState: 'idle',
    })),
    _(ac.setSearchInProgress, state => ({
      ...state,
      searchState: 'in-progress',
    })),
    _(ac.setSearchStandBy, state => ({
      ...state,
      searchState: 'stand-by',
    })),
    _(ac.setSearchFulfilled, (state, { payload }) => ({
      ...state,
      searchState: 'stand-by',
      searchResults: payload,
    })),
  ],
  ...[
    _(ac.setSearchScope, (state, { payload }) => ({
      ...state,
      searchScope: payload,
    })),
  ],
  ...[
    _(ac.setSearchTarget, (state, { payload }) => ({
      ...state,
      searchTarget: state.searchTarget.includes(payload)
        ? state.searchTarget.filter(type => type !== payload)
        : [...state.searchTarget, payload],
    })),
  ],
]);

export { reducer as searchReducer, ac as searchActionCreators };
export { SearchState };
