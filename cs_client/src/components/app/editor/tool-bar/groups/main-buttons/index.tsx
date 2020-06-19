import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon/icon';
import { modToolbar } from '::sass-modules/index';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
const mapState = (state: Store) => ({
  showTree: state.editor.showTree,
  documentHasUnsavedChanges: state.document.hasUnsavedChanges,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  selectedNodeId: string;
};

const MainButtons: React.FC<Props & PropsFromRedux> = ({
  showTree,
  selectedNodeId,
  documentHasUnsavedChanges,
}) => {
  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton onClick={ac.editor.toggleTree} enabled={showTree}>
        <Icon name={Icons.cherrytree.additionalIcons['cherries']} size={20} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaEdit}
        disabled={!selectedNodeId}
        testId={testIds.toolBar__main__editNodeMeta}
      >
        <Icon name={Icons.material.edit} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.toggleDeleteDocumentModal}
        disabled={!selectedNodeId}
        testId={testIds.toolBar__main__deleteNode}
      >
        <Icon name={Icons.material.delete} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaCreateSibling}
        testId={testIds.toolBar__main__createSiblingNode}
      >
        <Icon
          name={Icons.cherrytree.additionalIcons['tree-node-add']}
          size={20}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaCreateChild}
        testId={testIds.toolBar__main__createChildNode}
      >
        <Icon
          name={Icons.cherrytree.additionalIcons['tree-subnode-add']}
          size={20}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.document.save}
        testId={testIds.toolBar__main__saveDocument}
      >
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
