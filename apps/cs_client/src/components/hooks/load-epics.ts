import { useEffect, useState } from 'react';
import { createRootEpic } from '::store/epics/root';
import { epicMiddleware } from '::store/store';

const useLoadEpics = () => {
  const [loadedEpics, setLoadedEpics] = useState(false);
  useEffect(() => {
    createRootEpic()
      .then(epicMiddleware.run)
      .then(() => {
        setLoadedEpics(true);
      });
  }, []);
  return { loadedEpics };
};

export { useLoadEpics };
