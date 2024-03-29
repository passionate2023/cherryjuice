import { useMemo } from 'react';
import { ac } from '::store/store';
import { CMItem } from '@cherryjuice/components';

type Props = {
  online: boolean;
  rename: (id) => void;
  isOwnerOfActiveDocument: boolean;
};

export const useRowContextMenuItems = ({
  online,
  rename,
  isOwnerOfActiveDocument,
}: Props) => {
  return useMemo<CMItem[]>(
    () => [
      {
        name: '',
        nameFactory: (id, context) => (context.pinned ? 'unpin' : 'pin'),
        onClick: id => ac.documentCache.pinDocument(id),
        disabled: !isOwnerOfActiveDocument,
      },
      { name: 'rename', onClick: rename, disabled: !isOwnerOfActiveDocument },
      {
        name: 'edit',
        onClick: () => ac.dialogs.showEditDocumentDialog(),
        disabled: !isOwnerOfActiveDocument,
      },
      {
        name: 'cache',
        onClick: id => ac.node.fetchAll(id),
        disabled: id => !online || id.startsWith('new-document'),
      },
      {
        name: 'clone',
        onClick: id => ac.document.clone(id),
        disabled: !online,
      },
      {
        name: 'export',
        onClick: id => ac.document.export(id),
        disabled: !online,
      },
      {
        name: 'delete',
        onClick: () => void ac.dialogs.showDeleteDocument(),
        disabled: !online || !isOwnerOfActiveDocument,
      },
    ],
    [online, rename, isOwnerOfActiveDocument],
  );
};
