import { useEffect, useRef, useState } from 'react';

const useTimeout = ({ timeout, id }: { timeout: number; id: string }) => {
  const previousID = useRef('');
  const [timeHasElapsed, setTimeHasElapsed] = useState({ id, elapsed: false });
  useEffect(() => {
    const handle = setTimeout(() => {
      setTimeHasElapsed({ id, elapsed: true });
    }, timeout);
    return () => clearTimeout(handle);
  }, [timeout, id]);

  let res = false;
  if (timeHasElapsed.elapsed && timeHasElapsed.id == id)
    if (previousID.current === '') {
      previousID.current = id;
      res = true;
    } else if (previousID.current !== id) {
      previousID.current = id;
      res = true;
    }
  return { timeHasElapsed: res, id };
};

export { useTimeout };
