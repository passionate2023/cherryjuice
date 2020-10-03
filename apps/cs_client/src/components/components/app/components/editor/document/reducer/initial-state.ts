type TDocumentState = {
  pastedImages: number;
};
const state: TDocumentState = {
  pastedImages: 0,
};

export { state as documentInitialState };
export { TDocumentState };
