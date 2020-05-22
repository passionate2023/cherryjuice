type TDocumentState = {
  cacheTimeStamp: number;
  pastedImages: number;
  savingInProgress: boolean;
};
const state: TDocumentState = {
  cacheTimeStamp: undefined,
  pastedImages: undefined,
  savingInProgress: undefined,
};

export { state as documentInitialState };
export { TDocumentState };
