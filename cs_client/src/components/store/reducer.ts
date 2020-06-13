import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { documentReducer } from './ducks/document';
import { dialogsReducer } from './ducks/dialogs';
import { nodeReducer } from './ducks/node';

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
});

export { reducer };
