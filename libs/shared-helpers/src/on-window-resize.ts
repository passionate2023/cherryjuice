import { useEffect } from 'react';

type Callback = (w: number, h: number) => void;
export const useOnWindowResize = (callbacks: Callback[]) => {
  useEffect(() => {
    const handle = () => {
      callbacks.forEach(callback =>
        callback(window.innerWidth, window.innerHeight),
      );
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
};
