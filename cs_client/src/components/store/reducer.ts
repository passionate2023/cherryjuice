import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { documentReducer } from './ducks/document';
import { dialogsReducer } from './ducks/dialogs';
import { nodeReducer } from './ducks/node';
import { editorReducer } from './ducks/editor';
import { documentsListReducer } from './ducks/documents-list';
import { documentTransforms } from './redux-persist/transforms/document';
import { documentOperationsReducer } from './ducks/document-operations';
import { rootReducer } from '::root/store/ducks/root';

const reducer = combineReducers({
  document: persistReducer(
    {
      key: 'document',
      storage,
      blacklist: ['nodes', 'cacheTimeStamp', 'hasUnsavedChanges'],
      transforms: documentTransforms,
    },
    documentReducer,
  ),
  dialogs: dialogsReducer,
  node: nodeReducer,
  editor: persistReducer(
    {
      key: 'editor',
      storage,
    },
    editorReducer,
  ),
  documentsList: documentsListReducer,
  documentOperations: documentOperationsReducer,
  rootReducer: rootReducer,
});

export { reducer };
