import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon';
import { modToolbar } from '::sass-modules/index';
import { testIds } from '::cypress/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac } from '::root/store/actions.types';
const mapState = () => ({});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  showTree: boolean;
  documentHasUnsavedChanges: boolean;
  selectedNodeId: string;
};

const MainButtons: React.FC<Props & PropsFromRedux> = ({
  showTree,
  selectedNodeId,
  documentHasUnsavedChanges,
}) => {
  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton onClick={appActionCreators.toggleTree} enabled={showTree}>
        <Icon
          name={Icons.cherrytree.additionalIcons.cherries}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaEdit}
        disabled={!selectedNodeId}
      >
        <Icon name={Icons.material.edit} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.toggleDeleteDocumentModal}
        disabled={!selectedNodeId}
      >
        <Icon name={Icons.material.delete} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaCreateSibling}
        testId={testIds.toolBar__main__createSiblingNode}
      >
        <Icon
          name={Icons.cherrytree.additionalIcons['tree-node-add']}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaCreateChild}
        testId={testIds.toolBar__main__createChildNode}
      >
        <Icon
          name={Icons.cherrytree.additionalIcons['tree-subnode-add']}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton onClick={ac.document.save}>
        <Icon name={Icons.material.save} />
      </ToolbarButton>
      <ToolbarButton
        onClick={
          documentHasUnsavedChanges
            ? ac.dialogs.showReloadDocument
            : ac.document.fetchNodes
        }
      >
        <Icon name={Icons.material.refresh} />
      </ToolbarButton>
    </div>
  );
};
const _ = connector(MainButtons);
export { _ as MainButtons };
