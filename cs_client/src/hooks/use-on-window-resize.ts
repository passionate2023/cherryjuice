import { useEffect } from 'react';

const useOnWindowResize = (
  callbacks: Function[],
  hookDependency1?: boolean,
) => {
  useEffect(() => {
    const handle = () => {
      callbacks.forEach(callback => callback());
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, [hookDependency1]);
};

export { useOnWindowResize };
