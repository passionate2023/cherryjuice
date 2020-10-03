import * as React from 'react';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icons } from '::root/components/shared-components/icon/helpers/icons';
import { NumberOfFrames } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';

type Props = {
  redo: () => void;
  undo: () => void;
  nof: NumberOfFrames;
  buttonClassName?: string;
  dark?: boolean;
};

const UndoRedo: React.FC<Props> = ({
  undo,
  redo,
  nof,
  buttonClassName,
  dark,
}) => {
  return (
    <>
      <ButtonCircle
        iconName={Icons.material.undo}
        onClick={undo}
        disabled={!nof.undo}
        className={buttonClassName}
        dark={dark}
      />
      <ButtonCircle
        iconName={Icons.material.redo}
        onClick={redo}
        disabled={!nof.redo}
        className={buttonClassName}
        dark={dark}
      />
    </>
  );
};

export { UndoRedo };
