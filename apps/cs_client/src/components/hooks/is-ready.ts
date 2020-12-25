import { useEffect } from 'react';
import { rootAC } from '::root/reducer';

export const useComponentIsReady = (ready: boolean) => {
  useEffect(() => {
    if (ready) rootAC.setReady(true);
  }, [ready]);
};
