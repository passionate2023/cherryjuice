import {
  CachedDocumentState,
  NodesDict,
} from '::store/ducks/document-cache/document-cache';
import { NodeProps } from '::app/components/tabs/document-nodes/components/components/tab';
import { newNodePrefix } from '@cherryjuice/editor';

export const createNodePropsMapper = (
  nodes: NodesDict,
  localState: CachedDocumentState,
  selectedNode_id,
  showHome?: boolean,
  bookmarks?: Set<number>,
) => (node_id: number): NodeProps => {
  const node = nodes[node_id];
  return {
    node_id,
    name: node?.name || '?',
    hasChanges: !!localState.editedNodes.edited[node_id],
    isSelected: !showHome && selectedNode_id === node_id,
    isNew: node?.id?.startsWith(newNodePrefix),
    isBookmarked: bookmarks && bookmarks.has(node_id),
  };
};
