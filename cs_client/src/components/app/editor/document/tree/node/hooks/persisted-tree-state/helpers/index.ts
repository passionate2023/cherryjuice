import { NodeMeta } from '::types/graphql-adapters';

const getTree = () => {
  const savedState = localStorage.getItem('treeState');
  if (savedState) return JSON.parse(savedState);
  else return {};
};

const persistedTreeState = (() => {
  const state = {
    tree: getTree(),
  };
  return {
    get: file_id => {
      return state.tree[file_id] || {};
    },
    set: (file_id, scopedTree) => {
      state.tree = {
        ...state.tree,
        [file_id]: scopedTree,
      };
      localStorage.setItem('treeState', JSON.stringify(state.tree));
    },
    delete: file_id => {
      delete state.tree[file_id];
      localStorage.setItem('treeState', JSON.stringify(state.tree));
    },
  };
})();
const collapseAll = (
  id: number,
  treeState: Record<string, boolean>,
  nodes: Map<number, NodeMeta>,
) => {
  delete treeState[id];
  nodes.get(id)?.child_nodes.forEach(id => {
    collapseAll(id, treeState, nodes);
  });
};
const swapPersistedTreeStateDocumentId = (
  swappedDocumentIds: Record<string, string>,
): void => {
  Object.entries(swappedDocumentIds).forEach(([oldDocId, newDocId]) => {
    const tree = persistedTreeState.get(oldDocId);
    persistedTreeState.set(newDocId, tree);
    persistedTreeState.delete(oldDocId);
  });
};

export { swapPersistedTreeStateDocumentId, collapseAll, persistedTreeState };
