import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistDocumentReducer = reducer => {
  return persistReducer(
    {
      key: 'document',
      storage,
      blacklist: ['nodes'],
      transforms: [],
    },
    reducer,
  );
};

export { persistDocumentReducer };
