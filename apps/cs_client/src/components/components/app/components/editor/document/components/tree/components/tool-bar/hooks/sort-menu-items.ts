import { CMItem } from '::root/components/shared-components/context-menu/context-menu-item';
import { ac } from '::store/store';
import { SortNodeCommand } from '::store/ducks/document-cache/helpers/node/sort-node/helpers/sort-nods';
import { useCallback } from 'react';
import { noop } from 'rxjs';

type SortMenuItemsProps = { node_id: number; documentId: string };

const useSortMenuItems = ({
  node_id,
  documentId,
}: SortMenuItemsProps): CMItem[] => {
  const sort = useCallback(
    (command: SortNodeCommand) => {
      return () => ac.documentCache.sortNode({ documentId, node_id, command });
    },
    [node_id, documentId],
  );

  return [
    {
      name: 'sort',
      onClick: noop,
      items: [
        {
          name: 'current level',
          onClick: noop,
          items: [
            { name: 'name', onClick: sort({ level: 'current-level' }) },
            {
              name: 'name (desc)',
              onClick: sort({
                level: 'current-level',
                sortDirection: 'descending',
              }),
            },
          ],
        },
        {
          name: 'children',
          onClick: noop,
          items: [
            { name: 'name', onClick: sort({ level: 'children' }) },
            {
              name: 'name (desc)',
              onClick: sort({ level: 'children', sortDirection: 'descending' }),
            },
          ],
        },
        {
          name: 'all',
          onClick: noop,
          items: [
            { name: 'name', onClick: sort({ level: 'all' }) },
            {
              name: 'name (desc)',
              onClick: sort({ level: 'all', sortDirection: 'descending' }),
            },
          ],
        },
      ],
    },
  ];
};

export { useSortMenuItems };
