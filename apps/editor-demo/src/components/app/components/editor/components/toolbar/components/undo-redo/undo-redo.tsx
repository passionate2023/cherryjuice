import * as React from 'react';
import { useEffect, useState } from 'react';
import { ToolbarButton } from '@cherryjuice/components';
import { Icons } from '@cherryjuice/icons';
import { NumberOfFrames, pagesManager } from '@cherryjuice/editor';

type Props = { documentId: string };

const UndoRedo: React.FC<Props> = ({ documentId }) => {
  const noDocumentIsSelected = !documentId;
  const [numberOfFrames, setNumberOfFrames] = useState<NumberOfFrames>({
    redo: 0,
    undo: 0,
  });

  useEffect(() => {
    pagesManager.setOnFrameChange(setNumberOfFrames);
  }, []);

  return (
    <>
      <ToolbarButton
        onClick={pagesManager.current?.undo}
        disabled={noDocumentIsSelected || !numberOfFrames.undo}
        tooltip={{ label: 'Undo Text change' }}
        icon={Icons.material.undo}
      />
      <ToolbarButton
        onClick={pagesManager.current?.redo}
        disabled={noDocumentIsSelected || !numberOfFrames.redo}
        tooltip={{ label: 'Redo text change' }}
        icon={Icons.material.redo}
      />
    </>
  );
};

export { UndoRedo };
