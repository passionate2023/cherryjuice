import { useCallback } from 'react';
import { ac } from '::store/store';
import { CMItem } from '@cherryjuice/components';

type FoldMenuItemsProps = {
  documentId: string;
  node_id: number;
};

const useFoldMenuItems = ({ documentId, node_id }: FoldMenuItemsProps) => {
  const expandNode = useCallback(
    () =>
      ac.documentCache.expandNode({
        documentId,
        node_id,
        expandChildren: false,
      }),
    [documentId, node_id],
  );
  const collapseAllNodes = useCallback(
    () =>
      ac.documentCache.collapseNode({
        documentId,
        node_id: 0,
      }),
    [documentId],
  );
  const expandAllNodes = useCallback(
    async () =>
      ac.documentCache.expandNode({
        documentId,
        node_id: 0,
        mode: 'expand-all',
      }),
    [documentId],
  );
  const expandAllChildren = useCallback(
    async () =>
      ac.documentCache.expandNode({
        documentId,
        node_id,
        mode: 'expand-all-children',
      }),
    [documentId, node_id],
  );
  const folding: CMItem[] = [
    {
      name: 'folding',
      onClick: () => undefined,
      items: [
        {
          name: 'expand to current node',
          onClick: expandNode,
          hideOnClick: true,
        },
        {
          name: 'expand children',
          onClick: expandAllChildren,
          hideOnClick: true,
        },
        {
          name: 'expand all',
          onClick: expandAllNodes,
          hideOnClick: true,
          bottomSeparator: true,
        },
        {
          name: 'collapse all',
          onClick: collapseAllNodes,
          hideOnClick: true,
        },
      ],
    },
  ];
  return folding;
};

export { useFoldMenuItems };
