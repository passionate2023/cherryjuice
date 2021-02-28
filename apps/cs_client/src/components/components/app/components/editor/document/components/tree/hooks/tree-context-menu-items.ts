import { CMItem } from '@cherryjuice/components';
import { CopyNodeParams } from '::store/ducks/document-cache/helpers/node/copy-cut-paste/copy-node';
import {
  copyNode,
  copyNodeId,
  copyNodeLink,
  cutNode,
  pasteNode,
} from '::app/components/editor/document/components/tree/hooks/tree-context-menu-items/callbacks';

type TreeContextMenuItemsProps = {
  copiedNode: CopyNodeParams;
  rename: (id) => void;
  isOwnerOfCurrentDocument: boolean;
};

const useTreeContextMenuItems = ({
  copiedNode,
  rename,
  isOwnerOfCurrentDocument,
}: TreeContextMenuItemsProps): CMItem[] => {
  const items = [
    {
      name: 'rename',
      onClick: rename,
      disable: !isOwnerOfCurrentDocument,
    },
    {
      name: 'copy link',
      onClick: copyNodeLink,
    },
    {
      name: 'copy id',
      onClick: copyNodeId,
      bottomSeparator: true,
    },
    {
      name: 'copy',
      onClick: copyNode,
    },
    {
      name: 'cut',
      onClick: cutNode,
    },
  ];

  if (copiedNode)
    items.push({
      name: 'paste',
      onClick: pasteNode,
    });
  return items;
};

export { useTreeContextMenuItems };
