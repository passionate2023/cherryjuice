import { useEffect, useState } from 'react';
import { makeCancelable } from '::helpers/misc';
type FecthedSVG = { svg: string; path: string };

const useFetchSVG = (path: string): string => {
  const [fetched, setFetched] = useState('');
  useEffect(() => {
    const { cancel, promise } = makeCancelable(
      import(`::assets/icons/${path}.svg`).then(module => module.default),
    );
    promise.then(setFetched);
    return cancel;
  }, [path]);
  return fetched;
};

export { useFetchSVG };
export { FecthedSVG };
