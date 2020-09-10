import { useEffect } from 'react';
import { syncPersistedState } from '::store/tasks/sync-persisted-state';

const useTasks = () => {
  useEffect(() => {
    const sp = syncPersistedState();
    return () => {
      sp.unsubscribe();
    };
  }, []);
};

export { useTasks };
