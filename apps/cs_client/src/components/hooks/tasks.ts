import { useEffect } from 'react';
import { syncPersistedState } from '::store/tasks/sync-persisted-state';
import { networkStatus } from '::store/tasks/network-status';

const useTasks = () => {
  useEffect(() => {
    const sp = syncPersistedState();
    const ns = networkStatus();
    return () => {
      sp.unsubscribe();
      ns.unsubscribe();
    };
  }, []);
};

export { useTasks };
