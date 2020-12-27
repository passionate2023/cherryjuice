import * as React from 'react';
import { useLoadEpics } from '::root/hooks/load-epics';
import { Router } from 'react-router-dom';
import { router } from '::root/router/router';
import { Provider } from 'react-redux';
import { store } from '::store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import modTheme from '@cherryjuice/shared-styles/build/themes/themes.scss';
import { RootWithApollo } from '::root/root-with-apollo';

const RootWithRedux: React.FC = () => {
  const { loadedEpics } = useLoadEpics();
  return (
    <Router history={router.get.history}>
      {loadedEpics && (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistStore(store)}>
            <div className={modTheme.lightTheme}>
              <RootWithApollo />
            </div>
          </PersistGate>
        </Provider>
      )}
    </Router>
  );
};
export default RootWithRedux;
