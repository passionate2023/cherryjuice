import * as React from 'react';
import { useState } from 'react';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { modSelectFile } from '::sass-modules/index';
import { ThreeDotsPopup } from './three-dots-popup';
import { Icon, Icons } from '::shared-components/icon/icon';

type Props = {
  documentId: string;
};

const ThreeDotsButton: React.FC<Props> = ({ documentId }) => {
  const [showModal, setShowModal] = useState(false);
  useClickOutsideModal({
    cb: () => setShowModal(false),
    selectorsToIgnore: [
      modSelectFile.selectFile__file__threeDotsButton,
      modSelectFile.selectFile__file__threeDotsPopup,
      modSelectFile.selectFile__file__threeDotsPopup__item,
    ],
    isVisible: showModal,
  });
  return (
    <>
      <div className={`${modSelectFile.selectFile__file__threeDotsButton} `}>
        <Icon
          svg={{
            name: Icons.material.menu,
          }}
          onClick={() => {
            setShowModal(!showModal);
          }}
        />
        {showModal && <ThreeDotsPopup documentId={documentId} />}
      </div>
    </>
  );
};

export { ThreeDotsButton };
