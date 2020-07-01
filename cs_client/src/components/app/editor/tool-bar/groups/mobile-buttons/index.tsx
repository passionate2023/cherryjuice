import * as React from 'react';
import { modToolbar } from '::sass-modules/index';
import { ToolbarButton } from '../../tool-bar-button';
import { Icon, Icons } from '::shared-components/icon/icon';
import { appActionCreators } from '::app/reducer';
import { Separator } from '::app/editor/tool-bar/separator';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  showFormattingButtons: boolean;
  contentEditable: boolean;
  showRecentNodes: boolean;
  showInfoBar: boolean;
};

const MobileButtons: React.FC<Props & PropsFromRedux> = ({
  showFormattingButtons,
  showRecentNodes,
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
        onClick={appActionCreators.toggleFormattingButtons}
        active={showFormattingButtons}
        disabled={noDocumentIsSelected}
      >
        <Icon name={Icons.material['justify-left']} />
      </ToolbarButton>
      <Separator />
      <ToolbarButton
        onClick={appActionCreators.toggleRecentBar}
        active={showRecentNodes}
        disabled={noDocumentIsSelected}
      >
        <Icon name={Icons.material.history} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.toggleInfoBar}
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
