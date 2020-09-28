import { useEffect } from 'react';

const useOnWindowResize = (
  callbacks: ((w: number, h: number) => void)[],
  hookDependency1?: boolean,
) => {
  useEffect(() => {
    const handle = () => {
      callbacks.forEach(callback =>
        callback(window.innerWidth, window.innerHeight),
      );
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, [hookDependency1]);
};

export { useOnWindowResize };
