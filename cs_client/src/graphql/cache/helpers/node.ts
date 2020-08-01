import { NodeCached } from '::types/graphql-adapters';
import { NodeMetaIt } from '::types/graphql/generated';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { CacheState } from '::graphql/cache/initial-state';
import { ac } from '::root/store/store';
import { NodeIdDocumentId } from './image';

type MutateNodeProps = {
  nodeId: string;
  meta:
    | Omit<NodeMetaIt, 'updatedAt', 'node_id'>
    | { html?: string }
    | { updatedAt?: string };
};
const nodeHelpers = (state: CacheState) => ({
  get: (nodeId: string): NodeCached => {
    const node = state.cache?.data.get('Node:' + nodeId);
    if (node?.child_nodes?.json) node.child_nodes = node.child_nodes.json;
    return node;
  },
  create: (node: NodeCached) => {
    state.cache?.data.set('Node:' + node.id, node);
    state.modifications.document[node.documentId].node.created.add(node.id);
    ac.document.setCacheTimeStamp();
  },
  mutate: ({ nodeId, meta }: MutateNodeProps): void => {
    const node = apolloCache.node.get(nodeId);
    const { documentId } = node;

    if (meta['html']) {
      state.modifications.document[documentId].node.content.add(nodeId);
    } else {
      const nodeUnmodified = !state.modifications.document[
        documentId
      ].node.meta.get(nodeId);
      if (nodeUnmodified)
        state.modifications.document[documentId].node.meta.set(
          nodeId,
          new Set(),
        );
      Object.entries(meta).forEach(([key]) => {
        state.modifications.document[documentId].node.meta.get(nodeId).add(key);
      });
    }
    state.cache?.data.set('Node:' + nodeId, {
      ...node,
      ...meta,
      updatedAt: new Date().getTime(),
    });
    ac.document.setCacheTimeStamp();
  },
  swapId: ({
    oldId,
    newId,
    documentId,
  }: {
    oldId: string;
    newId: string;
    documentId: string;
  }) => {
    const node = apolloCache.node.get(oldId);
    node.id = newId;
    apolloCache.node.delete.hard({
      nodeId: oldId,
      documentId,
    });
    state.cache.data.set('Node:' + newId, node);
    return node;
  },
  delete: {
    soft: ({ nodeId, documentId }: NodeIdDocumentId): void => {
      state.modifications.document[documentId].node.deleted.add(nodeId);
      ac.document.setCacheTimeStamp();
    },
    hard: ({ nodeId, documentId }: NodeIdDocumentId): void => {
      state.cache.data.delete('Node:' + nodeId);
      state.modifications.document[documentId].node.deleted.delete(nodeId);
    },
  },
});

export { nodeHelpers };
