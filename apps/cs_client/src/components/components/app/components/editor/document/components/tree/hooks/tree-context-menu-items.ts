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
  const copyNodeId = useCallback(() => {
    navigator.clipboard.writeText('' + node_id).then(() => {
      ac.dialogs.setSnackbar({ message: 'node ID copied to clipboard' });
    });
  }, [node_id]);
  const copyNodeLink = useCallback(() => {
    navigator.clipboard
      .writeText(`${location.origin}/document/${documentId}/node/${node_id}`)
      .then(() => {
        ac.dialogs.setSnackbar({ message: 'node link copied to clipboard' });
      });
  }, [node_id, documentId]);
  const copyNode = useCallback(() => {
    ac.documentCache.copyNode({
      mode: 'copy',
      documentId,
      node_id,
    });
  }, [node_id, documentId]);

  const cutNode = useCallback(() => {
    ac.documentCache.copyNode({
      mode: 'cut',
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
  if (node_id) {
    items.push({
      name: 'copy link',
      onClick: copyNodeLink,
    });
    items.push({
      name: 'copy id',
      onClick: copyNodeId,
      bottomSeparator: true,
    });
    items.push({
      name: 'copy',
      onClick: copyNode,
    });
    items.push({
      name: 'cut',
      onClick: cutNode,
    });
  }
  if (copiedNode)
    items.push({
      name: 'paste',
      onClick: pasteNode,
    });
  return items;
};

export { useTreeContextMenuItems };
