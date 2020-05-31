type TDocumentState = {
  pastedImages: number;
  savingInProgress: boolean;
};
const state: TDocumentState = {
  pastedImages: 0,
  savingInProgress: false,
};

export { state as documentInitialState };
export { TDocumentState };
