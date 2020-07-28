import * as React from 'react';
import { useState } from 'react';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { modSelectFile } from '::sass-modules/index';
import { ThreeDotsPopup } from './three-dots-popup';
import { Icon, Icons } from '::shared-components/icon/icon';
import { VisibilityIcon } from '::app/editor/info-bar/components/components/visibility-icon';

type Props = {
  documentId: string;
  privacy: Privac;
};

const ThreeDotsButton: React.FC<Props> = ({ documentId, privacy }) => {
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
        {/*<VisibilityIcon privacy={privacy} />*/}
        <Icon
          name={Icons.material.menu}
          loadAsInlineSVG={'force'}
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
