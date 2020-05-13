import { NodeCached } from '::types/graphql/adapters';
import { Document } from '::types/graphql/generated';

const apolloCache = (() => {
  const state = {
    cache: undefined,
  };
  return {
    __setCache: cache => (state.cache = cache),
    getNode: (nodeId: string): NodeCached => {
      const node = state.cache?.data.get('Node:' + nodeId);
      if (node?.child_nodes.json) node.child_nodes = node.child_nodes.json;
      return node;
    },
    setNode: (nodeId: string, node: NodeCached): void =>
      state.cache?.data.set('Node:' + nodeId, node),
    deleteNode: (nodeId: string): void => {
      state.cache.data.delete('Node:' + nodeId);
    },
    setDocument: (documentId: string, document: Document): void =>
      state.cache?.data.set('Document:' + documentId, document),
    getDocument: (documentId: string): void =>
      state.cache?.data.get('Document:' + documentId),
  };
})();

export { apolloCache };
