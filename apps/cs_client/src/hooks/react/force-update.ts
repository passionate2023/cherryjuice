import { useEffect, useState } from 'react';

export const useForceUpdate = () => {
  const [, setFoo] = useState(0);
  useEffect(() => {
    setFoo(1);
  }, []);
};
