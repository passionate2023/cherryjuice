import { combineReducers, Reducer } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { documentReducer, DocumentState } from './ducks/document';
import { dialogsReducer } from './ducks/dialogs';
import { nodeReducer } from './ducks/node';
import { editorReducer } from './ducks/editor';
import { documentsListReducer } from './ducks/documents-list';
import { documentTransforms } from './redux-persist/transforms/document';
import { documentOperationsReducer } from './ducks/document-operations';
import { rootReducer, RootReducerState } from './ducks/root';
import { searchReducer, SearchReducerState } from './ducks/search';
import { cssVariablesReducer } from './ducks/css-variables';
import { authReducer } from './ducks/auth';
import { cacheReducer } from './ducks/cache/cache';
import { settingsReducer } from './ducks/settings';
import { documentCacheReducer } from '::store/ducks/cache/document-cache';
import { animationReducer } from '::store/ducks/animations';
import { timelinesReducer } from '::store/ducks/timelines';

const reducer = combineReducers({
  cache: persistReducer(
    {
      key: 'cache',
      storage,
    },
    cacheReducer,
  ),
  documentCache: documentCacheReducer,
  animation: animationReducer,
  document: persistReducer(
    {
      key: 'document',
      storage,
      whitelist: ['documentId'],
      transforms: documentTransforms,
    },
    documentReducer,
  ) as Reducer<DocumentState>,
  editor: persistReducer(
    {
      key: 'editor',
      storage,
    },
    editorReducer,
  ),
  settings: persistReducer(
    {
      key: 'settings',
      storage,
      whitelist: ['selectedScreen'],
    },
    settingsReducer,
  ),
  dialogs: dialogsReducer,
  auth: persistReducer(
    {
      key: 'auth',
      storage,
      blacklist: ['ongoingOperation', 'alert'],
    },
    authReducer,
  ),
  node: nodeReducer,
  documentsList: documentsListReducer,
  documentOperations: documentOperationsReducer,
  timelines: timelinesReducer,
  root: persistReducer(
    {
      key: 'root',
      storage,
      blacklist: [],
    },
    rootReducer,
  ) as Reducer<RootReducerState>,
  cssVariables: cssVariablesReducer,
  search: persistReducer(
    {
      key: 'search',
      storage,
      blacklist: ['query', 'searchResults', 'searchState'],
    },
    searchReducer,
  ) as Reducer<SearchReducerState>,
});

export { reducer };
