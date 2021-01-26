import { useMemo } from 'react';
import { ac } from '::store/store';
import { CMItem } from '::shared-components/context-menu/context-menu-item';

type Props = {
  online: boolean;
};

export const useRowContextMenuItems = ({ online }: Props) => {
  return useMemo<CMItem[]>(
    () => [
      {
        name: '',
        nameFactory: (id, context) => (context.pinned ? 'unpin' : 'pin'),
        onClick: id => ac.documentCache.pinDocument(id),
      },
      {
        name: 'edit',
        onClick: () => ac.dialogs.showEditDocumentDialog(),
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
        disabled: !online,
      },
    ],
    [online],
  );
};
