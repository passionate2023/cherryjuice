import * as React from 'react';
import { useState } from 'react';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { modSelectFile } from '::sass-modules';
import { ThreeDotsPopup } from './three-dots-popup';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';

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
    <>
      <div className={`${modSelectFile.selectFile__file__threeDotsButton} `}>
        <Icon
          name={Icons.material.menu}
          loadAsInlineSVG={'force'}
          onClick={() => {
            setShowModal(!showModal);
          }}
        />
        {showModal && (
          <ThreeDotsPopup documentId={documentId} online={online} />
        )}
      </div>
    </>
  );
};

export { ThreeDotsButton };
