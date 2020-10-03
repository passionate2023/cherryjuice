import { useRef } from 'react';

type Callback = () => void;

const useRunOnce = (callback: Callback) => {
  const run = useRef(false);
  if (!run.current) {
    callback();
    run.current = true;
  }
};

export { useRunOnce };
