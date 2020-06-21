import { useEffect, useState } from 'react';
import { createRootEpic } from '::root/store/epics/root';
import { epicMiddleware } from '::root/store/store';

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
