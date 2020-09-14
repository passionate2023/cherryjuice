import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { useEffect, useState } from 'react';
import { NumberOfFrames } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { SnapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback-manager';

export const snapBackManager = new SnapBackManager();

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const mapState = (state: Store) => ({
  node_id: getCurrentDocument(state)?.persistedState?.selectedNode_id,
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const getEditor = async (): Promise<HTMLDivElement> =>
  new Promise(res => {
    const interval = setInterval(() => {
      const editor = document.querySelector<HTMLDivElement>('#rich-text');
      if (editor) {
        clearInterval(interval);
        res(editor);
      }
    }, 100);
  });
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
    snapBackManager.setElementGetter(getEditor);
    snapBackManager.setOnFrameChange(setNumberOfFrames);
  }, []);

  useEffect(() => {
    if (documentId && node_id) {
      snapBackManager.setCurrent(documentId + '/' + node_id);
    }
  }, [node_id, documentId]);

  return (
    <>
      <ToolbarButton
        onClick={snapBackManager.current?.undo}
        disabled={noDocumentIsSelected || !numberOfFrames.undo}
      >
        <Icon name={Icons.material.undo} loadAsInlineSVG={'force'} />
      </ToolbarButton>
      <ToolbarButton
        onClick={snapBackManager.current?.redo}
        disabled={noDocumentIsSelected || !numberOfFrames.redo}
      >
        <Icon name={Icons.material.redo} loadAsInlineSVG={'force'} />
      </ToolbarButton>
    </>
  );
};
const _ = connector(UndoRedo);
export { _ as UndoRedo };
