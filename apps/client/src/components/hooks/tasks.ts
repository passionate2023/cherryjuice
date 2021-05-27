import { useEffect } from 'react';
import { syncPersistedState } from '::store/tasks/sync-persisted-state';
import { syncFolders } from '::store/tasks/sync-folders/sync-folders';

const useTasks = () => {
  useEffect(() => {
    const sp = syncPersistedState();
    const sf = syncFolders();
    return () => {
      sp.unsubscribe();
      sf.unsubscribe();
    };
  }, []);
};

export { useTasks };
