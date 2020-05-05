type TState = {
  nodes: {
    [node_id: string]: {
      imageIDs: string[];
    };
  };
};
const state: TState = {
  nodes: {},
};

export { state as documentInitialState };
export { TState as TDocumentState };
