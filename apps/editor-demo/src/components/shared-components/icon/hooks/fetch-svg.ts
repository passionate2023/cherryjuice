import { useEffect, useState } from 'react';
import { makeCancelable } from '::helpers/misc';

const useFetchSVG = (path: string): string => {
  const [fetched, setFetched] = useState('');
  useEffect(() => {
    const { cancel, promise } = makeCancelable(
      import(`::assets/icons/${path}.svg`).then(module => module.default),
    );
    promise.then(setFetched).catch(() => undefined);
    return () => {
      cancel();
    };
  }, [path]);
  return fetched;
};

export { useFetchSVG };
