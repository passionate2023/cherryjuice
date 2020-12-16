import * as React from 'react';
import { useEffect, useState } from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { NumberOfFrames, pagesManager } from '@cherryjuice/editor';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { Tooltip } from '::root/components/shared-components/tooltip/tooltip';
import { useFlagNodeContentChange } from '::app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/hooks/flag-node-content-change';
import { useCacheNodeContent } from '::app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/hooks/cache-node-content';

const mapState = (state: Store) => ({
  node_id: getCurrentDocument(state)?.persistedState?.selectedNode_id,
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const UndoRedo: React.FC<Props & PropsFromRedux> = ({
  node_id,
  documentId,
}) => {
  const noDocumentIsSelected = !documentId;
  const [numberOfFrames, setNumberOfFrames] = useState<NumberOfFrames>({
    redo: 0,
    undo: 0,
  });

  useEffect(() => {
    pagesManager.setOnFrameChange(setNumberOfFrames);
  }, []);

  useFlagNodeContentChange(documentId, node_id, numberOfFrames);
  useCacheNodeContent(documentId, node_id, numberOfFrames);
  return (
    <>
      <ToolbarButton
        onClick={pagesManager.current?.undo}
        disabled={noDocumentIsSelected || !numberOfFrames.undo}
      >
        <Tooltip label={'Undo text change'}>
          <Icon name={Icons.material.undo} loadAsInlineSVG={'force'} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        onClick={pagesManager.current?.redo}
        disabled={noDocumentIsSelected || !numberOfFrames.redo}
      >
        <Tooltip label={'Redo text change'}>
          <Icon name={Icons.material.redo} loadAsInlineSVG={'force'} />
        </Tooltip>
      </ToolbarButton>
    </>
  );
};
const _ = connector(UndoRedo);
export { _ as UndoRedo };
