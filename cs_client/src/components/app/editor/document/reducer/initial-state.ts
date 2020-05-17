type TDocumentState = {
  cacheTimeStamp: number;
};
const state: TDocumentState = {
  // nodes: {},
  // nodesWhomContentHasChanged: new Set<string>(),
  cacheTimeStamp: undefined,
};

export { state as documentInitialState };
export { TDocumentState };
