import { useRef } from 'react';

const useIsNotProcessed = (IDs: (string | number)[]) => {
  const alreadyProcessed = useRef<{ [id: string]: boolean }>({});
  let isNotProcessed = Boolean(IDs.length);
  IDs.forEach(id => {
    if (alreadyProcessed.current[id]) isNotProcessed = false;
    alreadyProcessed.current[id] = true;
  });
  return isNotProcessed;
};

export { useIsNotProcessed };
