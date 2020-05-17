import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon';
import { modToolbar } from '::sass-modules/index';

type Props = {
  showTree: boolean;
  documentHasUnsavedChanges: boolean;
  selectedNodeId;
};

const MainButtons: React.FC<Props> = ({
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
      <ToolbarButton onClick={appActionCreators.showNodeMetaCreateSibling} testId={"create-sibling-node"}>
        <Icon
          name={Icons.cherrytree.additionalIcons['tree-node-add']}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.showNodeMetaCreateChild} testId={"create-child-node"}>
        <Icon
          name={Icons.cherrytree.additionalIcons['tree-subnode-add']}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.saveDocument}>
        <Icon name={Icons.material.save} />
      </ToolbarButton>
      <ToolbarButton
        onClick={
          documentHasUnsavedChanges
            ? appActionCreators.showReloadConfirmationModal
            : appActionCreators.reloadDocument
        }
      >
        <Icon name={Icons.material.refresh} />
      </ToolbarButton>
    </div>
  );
};

export { MainButtons };
