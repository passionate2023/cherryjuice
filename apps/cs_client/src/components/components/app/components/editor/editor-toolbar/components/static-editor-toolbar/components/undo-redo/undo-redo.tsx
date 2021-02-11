import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import { ToolbarButton } from '@cherryjuice/components';
import { Icons } from '@cherryjuice/icons';
import { NumberOfFrames, pagesManager } from '@cherryjuice/editor';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UndoRedo: React.FC<PropsFromRedux> = ({ documentId }) => {
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
const _ = connector(UndoRedo);
const M = memo(_);
export { M as UndoRedo };
