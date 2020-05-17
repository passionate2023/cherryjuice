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
};
const state: TDocumentState = {
  nodes: {},
};

export { state as documentInitialState };
export { TEditedNode, TEditedNodes, TDocumentState };
