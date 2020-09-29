import * as React from 'react';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { modSelectFile } from '::sass-modules';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { ac } from '::store/store';

type Props = {
  documentId: string;
  online: boolean;
  show: () => void;
  hide: () => void;
  shown: boolean;
};

const DocumentContextMenu: React.FC<Props> = ({
  documentId,
  online,
  show,
  hide,
  shown,
}) => {
  useClickOutsideModal({
    callback: show,
    selector: '.' + modSelectFile.selectFile__file__threeDotsPopup,
  });
  const items = [
    {
      name: 'edit',
      onClick: () => ac.dialogs.showEditDocumentDialog(documentId),
    },
    {
      name: 'cache',
      onClick: () => ac.node.fetchAll(documentId),
      disabled: !online || documentId.startsWith('new-document'),
    },
    {
      name: 'clone',
      onClick: () => ac.document.clone(documentId),
    },
    {
      name: 'export',
      onClick: ac.document.export,
      disabled: !online,
    },
    {
      name: 'delete',
      onClick: () => ac.dialogs.showDeleteDocument(),
      disabled: !online,
    },
  ];
  return (
    <div className={`${modSelectFile.selectFile__file__threeDotsButton} `}>
      <ContextMenuWrapper hide={hide} shown={shown} show={show} items={items}>
        <Icon name={Icons.material.menu} loadAsInlineSVG={'force'} />
      </ContextMenuWrapper>
    </div>
  );
};

export { DocumentContextMenu };
