import { CMItem } from '::root/components/shared-components/context-menu/context-menu-item';
import { ac } from '::store/store';
import { useCallback } from 'react';
import { CopyNodeParams } from '::store/ducks/document-cache/helpers/node/copy-cut-paste/copy-node';

type TreeContextMenuItemsProps = {
  node_id: number;
  documentId: string;
  copiedNode: CopyNodeParams;
};

const useTreeContextMenuItems = ({
  node_id,
  documentId,
  copiedNode,
}: TreeContextMenuItemsProps): CMItem[] => {
  const copyNode = useCallback(() => {
    ac.documentCache.copyNode({
      mode: 'copy',
      recursive: false,
      documentId,
      node_id,
    });
  }, [node_id, documentId]);

  const pasteNode = useCallback(() => {
    ac.documentCache.pasteNode({
      documentId,
      new_father_id: node_id,
    });
  }, [node_id, documentId]);
  const items = [];
  if (node_id)
    items.push({
      name: 'copy',
      onClick: copyNode,
    });
  if (copiedNode)
    items.push({
      name: 'paste',
      onClick: pasteNode,
    });
  return items;
};

export { useTreeContextMenuItems };
