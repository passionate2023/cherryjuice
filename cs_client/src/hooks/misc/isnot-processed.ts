const createIsNotProcessed = () => {
  const alreadyProcessed: { current: { [id: string]: boolean } } = {
    current: {},
  };
  return (...IDs: (string | number)[]) => {
    let isNotProcessed = Boolean(IDs.filter(Boolean).length);
    IDs.forEach(id => {
      if (alreadyProcessed.current[id]) isNotProcessed = false;
      alreadyProcessed.current[id] = true;
    });
    return isNotProcessed;
  };
};

export { createIsNotProcessed };
