import { useEffect } from 'react';

const useOnWindowResize = (callbacks: Function[]) => {
  useEffect(() => {
    const handle = () => {
      callbacks.forEach(callback => callback());
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
};

export { useOnWindowResize };
