type TEditedNode = {
  fetchedImageIDs: string[];
  edited: boolean;
};
type TEditedNodes = {
  [nodeId: string]: TEditedNode;
};
type TState = {
  nodes: TEditedNodes;
};
const state: TState = {
  nodes: {},
};

export { state as documentInitialState };
export { TEditedNode, TEditedNodes, TState as TDocumentState };
