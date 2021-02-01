import { useEffect } from 'react';
import { syncPersistedState } from '::store/tasks/sync-persisted-state';
import { networkStatus } from '::store/tasks/network-status';
import { syncFolders } from '::store/tasks/sync-folders/sync-folders';

const useTasks = () => {
  useEffect(() => {
    const sp = syncPersistedState();
    const ns = networkStatus();
    const sf = syncFolders();
    return () => {
      sp.unsubscribe();
      ns.unsubscribe();
      sf.unsubscribe();
    };
  }, []);
};

export { useTasks };
