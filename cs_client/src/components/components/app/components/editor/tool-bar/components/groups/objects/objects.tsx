import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { modToolbar } from '::sass-modules';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const mapState = (state: Store) => {
  return {
    selectedNode_id: getCurrentDocument(state)?.persistedState?.selectedNode_id,
    documentId: state.document.documentId,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Buttons: React.FC<PropsFromRedux> = ({ selectedNode_id, documentId }) => {
  const disabled = !documentId || !selectedNode_id;
  return (
    <>
      <ToolbarButton
        onClick={ac.dialogs.showAnchorDialog}
        className={modToolbar.toolBar__iconStrictWidth}
        disabled={disabled}
      >
        <Icon name={Icons.material.anchor} />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.dialogs.showLinkDialog}
        className={modToolbar.toolBar__iconStrictWidth}
        disabled={disabled}
      >
        <Icon name={Icons.material.link} />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.dialogs.showCodeboxDialog}
        className={modToolbar.toolBar__iconStrictWidth}
        disabled={disabled}
      >
        <Icon name={Icons.material.code} />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.dialogs.showTableDialog}
        className={modToolbar.toolBar__iconStrictWidth}
        disabled={disabled}
      >
        <Icon name={Icons.material.table} />
      </ToolbarButton>
    </>
  );
};
const Objects = connector(Buttons);
export { Objects };
