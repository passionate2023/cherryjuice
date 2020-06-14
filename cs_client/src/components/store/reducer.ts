import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { documentReducer } from './ducks/document';
import { dialogsReducer } from './ducks/dialogs';
import { nodeReducer } from './ducks/node';
import { editorReducer } from './ducks/editor';

const reducer = combineReducers({
  document: persistReducer(
    {
      key: 'document',
      storage,
      blacklist: ['nodes'],
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
});

export { reducer };
