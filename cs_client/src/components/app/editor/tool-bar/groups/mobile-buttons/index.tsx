import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { ToolbarButton } from '../../tool-bar-button';
import { Icon, Icons } from '::shared-components/icon/icon';
import { Separator } from '::app/editor/tool-bar/separator';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { hasWriteAccessToDocument } from '::root/store/selectors/document/has-write-access-to-document';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  showFormattingButtons: state.editor.showFormattingButtons,
  contentEditable: state.editor.contentEditable,
  showRecentNodesBar: state.editor.showRecentNodesBar,
  showInfoBar: state.editor.showInfoBar,
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const MobileButtons: React.FC<Props & PropsFromRedux> = ({
  showFormattingButtons,
  showRecentNodesBar,
  showInfoBar,
  documentId,
  isDocumentOwner,
}) => {
  const noDocumentIsSelected = !documentId;
  return (
    <>
      {isDocumentOwner && <Separator />}
      <div
        className={[
          modToolbar.toolBar__group,
          modToolbar.toolBar__groupMobileButtons,
        ].join(' ')}
      >
        <ToolbarButton
          dontMount={!isDocumentOwner}
          onClick={ac.editor.toggleFormattingBar}
          active={showFormattingButtons}
        >
          <Icon name={Icons.material['justify-left']} />
        </ToolbarButton>
        <Separator />
        <ToolbarButton
          onClick={ac.editor.toggleRecentNodesBar}
          active={showRecentNodesBar}
          disabled={noDocumentIsSelected}
        >
          <Icon name={Icons.material.history} />
        </ToolbarButton>
        <ToolbarButton
          onClick={ac.editor.toggleInfoBar}
          active={showInfoBar}
          disabled={noDocumentIsSelected}
        >
          <Icon name={Icons.material.info} />
        </ToolbarButton>
      </div>
    </>
  );
};

const _ = connector(MobileButtons);
export { _ as MobileButtons };
