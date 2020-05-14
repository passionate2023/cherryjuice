type TEditedNode = {
  fetchedImageIDs: string[];
  edited: {
    content: boolean;
    meta: string[];
  };
  new: boolean;
  deleted: boolean;
};
type TEditedNodes = {
  [nodeId: string]: TEditedNode;
};
type TDocumentState = {
  nodes: TEditedNodes;
  documentHasUnsavedNodes: boolean;
};
const state: TDocumentState = {
  nodes: {},
  documentHasUnsavedNodes: false,
};

export { state as documentInitialState };
export { TEditedNode, TEditedNodes, TDocumentState };
