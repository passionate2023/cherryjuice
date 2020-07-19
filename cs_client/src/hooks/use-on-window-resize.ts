import { useEffect } from 'react';

const useOnWindowResize = (callbacks: Function[], dependency1?: any) => {
  useEffect(() => {
    const handle = () => {
      callbacks.forEach(callback => callback());
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, [callbacks, dependency1]);
};

export { useOnWindowResize };
