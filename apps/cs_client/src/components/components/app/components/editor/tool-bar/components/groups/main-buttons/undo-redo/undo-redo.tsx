import * as React from 'react';
import { useEffect, useState } from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { Icon, Icons } from '@cherryjuice/icons';
import { NumberOfFrames, pagesManager } from '@cherryjuice/editor';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { Tooltip } from '::root/components/shared-components/tooltip/tooltip';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const UndoRedo: React.FC<Props & PropsFromRedux> = ({ documentId }) => {
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
      >
        <Tooltip label={'Undo text change'}>
          <Icon name={Icons.material.undo} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        onClick={pagesManager.current?.redo}
        disabled={noDocumentIsSelected || !numberOfFrames.redo}
      >
        <Tooltip label={'Redo text change'}>
          <Icon name={Icons.material.redo} />
        </Tooltip>
      </ToolbarButton>
    </>
  );
};
const _ = connector(UndoRedo);
export { _ as UndoRedo };
