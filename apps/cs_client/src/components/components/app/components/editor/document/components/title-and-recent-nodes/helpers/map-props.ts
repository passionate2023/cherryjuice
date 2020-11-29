import {
  CachedDocumentState,
  NodesDict,
} from '::store/ducks/document-cache/document-cache';
import { NodeProps } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';
import { newNodePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';

export const createNodePropsMapper = (
  nodes: NodesDict,
  localState: CachedDocumentState,
  selectedNode_id,
  bookmarks?: Set<number>,
) => (node_id: number): NodeProps => {
  const node = nodes[node_id];
  return {
    node_id,
    name: node?.name || '?',
    hasChanges: !!localState.editedNodes.edited[node_id],
    isSelected: selectedNode_id === node_id,
    isNew: node?.id?.startsWith(newNodePrefix),
    isBookmarked: bookmarks && bookmarks.has(node_id),
  };
};
