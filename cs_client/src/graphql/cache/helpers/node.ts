import { NodeCached } from '::types/graphql/adapters';
import { NodeMetaIt } from '::types/graphql/generated';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { CacheState } from '::graphql/cache/initial-state';
import { ac } from '::root/store/actions.types';

const nodeHelpers = (state: CacheState) => ({
  get: (nodeId: string): NodeCached => {
    const node = state.cache?.data.get('Node:' + nodeId);
    if (node?.child_nodes.json) node.child_nodes = node.child_nodes.json;
    return node;
  },
  create: (node: NodeCached) => {
    state.cache?.data.set('Node:' + node.id, node);
    state.modifications.node.created[node.id] = true;
    ac.document.setCacheTimeStamp();
  },
  mutate: ({
    nodeId,
    meta,
  }: {
    nodeId: string;
    meta: NodeMetaIt | { html?: string } | { updatedAt?: string };
  }): void => {
    const modificationType = meta['html'] ? 'content' : 'meta';
    const node = apolloCache.node.get(nodeId);
    if (!state.modifications.node[modificationType][nodeId])
      state.modifications.node[modificationType][nodeId] = {};
    Object.entries(meta).forEach(([key]) => {
      state.modifications.node[modificationType][nodeId][key] = true;
    });
    state.cache?.data.set('Node:' + nodeId, {
      ...node,
      ...meta,
      updatedAt: new Date().getTime(),
    });
    ac.document.setCacheTimeStamp();
  },
  swapId: ({ oldId, newId }: { oldId: string; newId: string }) => {
    const node = apolloCache.node.get(oldId);
    node.id = newId;
    apolloCache.node.delete.hard(oldId);
    state.cache.data.set('Node:' + newId, node);
    return node;
  },
  delete: (() => ({
    soft: (nodeId: string): void => {
      state.modifications.node.deleted[nodeId] = 'soft';
      ac.document.setCacheTimeStamp();
    },
    hard: (nodeId: string): void => {
      state.cache.data.delete('Node:' + nodeId);
      delete state.modifications.node.deleted[nodeId];
    },
  }))(),
  deletedAllModified: () => {
    [
      ...apolloCache.changes.node.created,
      ...apolloCache.changes.node.deleted,
      ...apolloCache.changes.node.html,
      ...apolloCache.changes.node.meta.map(([nodeId]) => nodeId),
    ].forEach(([nodeId]) => {
      apolloCache.node.delete.hard('Node:' + nodeId);
    });
    ac.document.setCacheTimeStamp(0);
  },
});

export { nodeHelpers };