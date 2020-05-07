type TState = {
  nodes: {
    [nodeId: string]: {
      edited: boolean;
    };
  };
};
const state: TState = {
  nodes: {},
};

export { state as documentInitialState };
export { TState as TDocumentState };
