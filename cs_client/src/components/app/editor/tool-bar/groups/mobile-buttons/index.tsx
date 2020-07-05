import * as React from 'react';
import { modToolbar } from '::sass-modules/index';
import { ToolbarButton } from '../../tool-bar-button';
import { Icon, Icons } from '::shared-components/icon/icon';
import { Separator } from '::app/editor/tool-bar/separator';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  showFormattingButtons: state.editor.showFormattingButtons,
  contentEditable: state.editor.contentEditable,
  showRecentNodesBar: state.editor.showRecentNodesBar,
  showInfoBar: state.editor.showInfoBar,
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
}) => {
  const noDocumentIsSelected = !documentId;
  return (
    <div
      className={[
        modToolbar.toolBar__group,
        modToolbar.toolBar__groupMobileButtons,
      ].join(' ')}
    >
      <ToolbarButton
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
  );
};

const _ = connector(MobileButtons);
export { _ as MobileButtons };
