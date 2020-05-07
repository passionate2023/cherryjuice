import { useRef } from 'react';

const useIsNotProcessed = (IDs: (string | number)[]) => {
  const alreadyProcessed = useRef<{ [id: string]: boolean }>({});
  let isNotProcessed = Boolean(IDs.length);
  IDs.forEach(id => {
    isNotProcessed = !alreadyProcessed.current[id];
    alreadyProcessed.current[id] = true;
  });
  return isNotProcessed;
};

export { useIsNotProcessed };
