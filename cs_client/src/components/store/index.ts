import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { documentReducer } from '::root/store/ducks/document';
import { rootEpic } from '::root/store/epics';
import { dialogsReducer } from '::root/store/ducks/dialogs';

const epicMiddleware = createEpicMiddleware();
const middleware = applyMiddleware(epicMiddleware);

const rootReducer = combineReducers({
  document: documentReducer,
  dialogs: dialogsReducer,
});
type Store = ReturnType<typeof rootReducer>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(middleware));
// @ts-ignore
epicMiddleware.run(rootEpic);

export { store };
export { Store };
