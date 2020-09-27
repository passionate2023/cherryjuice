import * as React from 'react';
import { useState } from 'react';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { modSelectFile } from '::sass-modules';
import { ThreeDotsPopup } from './three-dots-popup';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';

type Props = {
  documentId: string;
  online: boolean;
};

const ThreeDotsButton: React.FC<Props> = ({ documentId, online }) => {
  const [showModal, setShowModal] = useState(false);
  useClickOutsideModal({
    callback: () => setShowModal(false),
    selector: '.' + modSelectFile.selectFile__file__threeDotsPopup,
  });
  return (
    <div className={`${modSelectFile.selectFile__file__threeDotsButton} `}>
      <ContextMenuWrapper
        hide={() => setShowModal(false)}
        shown={showModal}
        show={() => setShowModal(true)}
        contextMenu={<ThreeDotsPopup documentId={documentId} online={online} />}
      >
        <Icon name={Icons.material.menu} loadAsInlineSVG={'force'} />
      </ContextMenuWrapper>
    </div>
  );
};

export { ThreeDotsButton };
