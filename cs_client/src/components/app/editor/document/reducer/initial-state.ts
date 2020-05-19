type TDocumentState = {
  cacheTimeStamp: number;
};
const state: TDocumentState = {
  cacheTimeStamp: undefined,
};

export { state as documentInitialState };
export { TDocumentState };
