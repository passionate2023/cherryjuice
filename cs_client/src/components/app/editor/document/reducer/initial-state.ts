type TDocumentState = {
  cacheTimeStamp: number;
  pastedImages: number;
};
const state: TDocumentState = {
  cacheTimeStamp: undefined,
  pastedImages: undefined,
};

export { state as documentInitialState };
export { TDocumentState };
