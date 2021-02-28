import * as React from 'react';
import { DialogListItem } from '::root/components/shared-components/dialog/dialog-list/dialog-list-item';
import { ac } from '::store/store';
import { CMItem } from '@cherryjuice/components';
import { Direction } from '::helpers/shared';

export type BookmarkProps = {
  name: string;
  node_id: number;
  i: number;
};
type Props = BookmarkProps & {
  selected: boolean;
  active: boolean;
  documentId: string;
  numberOfBookmarks: number;
};
const Bookmark: React.FC<Props> = ({
  name,
  node_id,
  selected,
  active,
  documentId,
  i,
  numberOfBookmarks,
}) => {
  const directions: [Direction, boolean, string][] = [
    [Direction.top, i === 0, 'to the '],
    [Direction.up, i === 0, ''],
    [Direction.down, i === numberOfBookmarks - 1, ''],
    [Direction.bottom, i === numberOfBookmarks - 1, 'to the '],
  ];
  const contextMenuOptions: CMItem[] = [
    {
      name: 'remove from bookmarks',
      onClick: () => ac.documentCache.removeBookmark({ node_id, documentId }),
    },
    ...directions.map(([direction, disabled, prefix]) => ({
      disabled,
      name: 'move ' + prefix + direction,
      direction,
      onClick: () =>
        ac.documentCache.moveBookmark({ documentId, node_id, direction }),
    })),
  ];
  return (
    <DialogListItem
      name={name}
      id={'node' + node_id}
      active={active}
      selected={selected}
      onClick={() => ac.bookmarks.select(node_id)}
      cmItems={contextMenuOptions}
      disabled={false}
    />
  );
};

export { Bookmark };
