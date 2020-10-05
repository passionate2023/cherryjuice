import * as React from 'react';
import { DialogListItem } from '::root/components/shared-components/dialog/dialog-list/dialog-list-item';
import { ac } from '::store/store';
import { ContextMenuItemProps } from '::root/components/shared-components/context-menu/context-menu-item';
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
  const contextMenuOptions: Omit<ContextMenuItemProps, 'hide'>[] = [
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
      active={active}
      selected={selected}
      onClick={() => ac.bookmarks.select(node_id)}
      contextMenuOptions={contextMenuOptions}
      disabled={false}
    />
  );
};

export { Bookmark };
