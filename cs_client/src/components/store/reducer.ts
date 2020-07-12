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
import { rootReducer } from '::root/store/ducks/root';
import { searchReducer, SearchReducerState } from '::root/store/ducks/search';
import { cssVariablesReducer } from '::root/store/ducks/css-variables';

const reducer = combineReducers({
  document: persistReducer(
    {
      key: 'document',
      storage,
      blacklist: ['nodes', 'cacheTimeStamp', 'hasUnsavedChanges'],
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
  dialogs: dialogsReducer,
  node: nodeReducer,
  documentsList: documentsListReducer,
  documentOperations: documentOperationsReducer,
  root: rootReducer,
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
